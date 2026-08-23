import { NextResponse } from 'next/server';

import { auth } from '../../../../auth';
import getMongoClient, { siliconDbName } from '../../../../src/mongodb';
import { getUserLanguageCodes } from '../../../../src/settings/auth/languages';
import { getUserRole, hasLevel } from '../../../../src/settings/auth/roles';

const REVIEW_DRAFTS_COLLECTION = 'homescreen_review_edits';

type PersistedTranslationInfo = {
  index: number;
  edit?: string;
  vote?: 0 | 1 | 2;
  comment?: string;
};

function normalizeLanguageCode(value: string): string {
  return value.trim().toLowerCase().slice(0, 32);
}

function cleanDraftText(value: unknown, maxLength: number): string | undefined {
  if (typeof value !== 'string') return undefined;
  return value.slice(0, maxLength);
}

function cleanVote(value: unknown): 0 | 1 | 2 | undefined {
  return value === 0 || value === 1 || value === 2 ? value : undefined;
}

function cleanEntries(value: unknown): PersistedTranslationInfo[] {
  if (!Array.isArray(value)) return [];

  const cleaned = value
    .map((entry) => {
      if (!entry || typeof entry !== 'object') return null;
      const rawIndex = (entry as { index?: unknown }).index;
      if (!Number.isInteger(rawIndex) || typeof rawIndex !== 'number' || rawIndex < 0) return null;

      const edit = cleanDraftText((entry as { edit?: unknown }).edit, 500);
      const comment = cleanDraftText((entry as { comment?: unknown }).comment, 2000);
      const vote = cleanVote((entry as { vote?: unknown }).vote);

      if (edit === undefined && comment === undefined && vote === undefined) return null;

      return {
        index: rawIndex,
        ...(edit !== undefined ? { edit } : {}),
        ...(comment !== undefined ? { comment } : {}),
        ...(vote !== undefined ? { vote } : {}),
      };
    })
    .filter((entry): entry is PersistedTranslationInfo => entry != null);

  cleaned.sort((a, b) => a.index - b.index);
  return cleaned;
}

async function requireDraftAccess(targetLanguageRaw: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: 'Not signed in' }, { status: 401 }),
    };
  }

  const targetLanguage = normalizeLanguageCode(targetLanguageRaw);
  if (!targetLanguage) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: 'Missing target language' }, { status: 400 }),
    };
  }

  const [role, allowedLanguages] = await Promise.all([
    getUserRole(userId),
    getUserLanguageCodes(userId),
  ]);
  if (!hasLevel(role, 'admin') && !allowedLanguages.includes(targetLanguage)) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: 'Not allowed for this language' }, { status: 403 }),
    };
  }

  return { ok: true as const, userId, targetLanguage };
}

async function draftsCollection() {
  const client = await getMongoClient();
  return client.db(siliconDbName()).collection(REVIEW_DRAFTS_COLLECTION);
}

export async function GET(_request: Request, context: { params: Promise<{ language: string }> }) {
  try {
    const { language } = await context.params;
    const access = await requireDraftAccess(language);
    if (!access.ok) return access.response;

    const draft = await (
      await draftsCollection()
    ).findOne(
      { userId: access.userId, targetLanguage: access.targetLanguage },
      { projection: { _id: 0, entries: 1 } },
    );

    return NextResponse.json({
      success: true,
      entries: cleanEntries(draft?.entries),
    });
  } catch (error) {
    console.error('Error loading review draft:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load saved review draft.' },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, context: { params: Promise<{ language: string }> }) {
  try {
    const { language } = await context.params;
    const access = await requireDraftAccess(language);
    if (!access.ok) return access.response;

    const body = (await request.json().catch(() => null)) as { entries?: unknown } | null;
    const entries = cleanEntries(body?.entries);
    const collection = await draftsCollection();

    if (entries.length === 0) {
      await collection.deleteOne({ userId: access.userId, targetLanguage: access.targetLanguage });
      return NextResponse.json({ success: true, entries });
    }

    const now = new Date();
    await collection.updateOne(
      { userId: access.userId, targetLanguage: access.targetLanguage },
      {
        $set: {
          userId: access.userId,
          targetLanguage: access.targetLanguage,
          entries,
          updatedAt: now,
        },
        $setOnInsert: {
          createdAt: now,
        },
      },
      { upsert: true },
    );

    return NextResponse.json({ success: true, entries });
  } catch (error) {
    console.error('Error saving review draft:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save review draft.' },
      { status: 500 },
    );
  }
}
