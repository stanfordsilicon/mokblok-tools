import { NextResponse } from 'next/server';

import { auth } from '../../../auth';
import {
  listUserLanguageRequests,
  requestUserLanguage,
} from '../../../src/settings/auth/languages';

function notSignedIn() {
  return NextResponse.json({ success: false, error: 'Not signed in' }, { status: 401 });
}

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return notSignedIn();

  try {
    const languages = await listUserLanguageRequests(userId);
    return NextResponse.json({ success: true, languages });
  } catch (error) {
    console.error('Error loading user languages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load your language requests.' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return notSignedIn();

  try {
    const body = (await request.json().catch(() => null)) as { requestedName?: unknown } | null;
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Enter the language you want to request.' },
        { status: 400 },
      );
    }

    const result = await requestUserLanguage(userId, String(body.requestedName ?? ''));
    if (!result.ok) {
      return NextResponse.json({ success: false, error: result.error }, { status: result.status });
    }

    return NextResponse.json({ success: true, language: result.language });
  } catch (error) {
    console.error('Error requesting a language:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save that language request.' },
      { status: 500 },
    );
  }
}
