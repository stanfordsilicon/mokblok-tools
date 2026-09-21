import { readdir } from 'node:fs/promises';
import path from 'node:path';

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** These files are already public; discovery must not depend on MongoDB or auth. */
export async function GET() {
  try {
    const files = await readdir(path.join(process.cwd(), 'public/input_tsvs')).catch((error) => {
      if (error.code === 'ENOENT') return [];
      throw error;
    });
    const languages = new Set<string>();
    for (const file of files) {
      const match = file.match(/^([a-z]{2,3}(?:-[a-z0-9]{2,8})*)_(2_[123]|[134])\.(tsv|txt)$/i);
      if (match && match[3] === (['3', '4'].includes(match[2]) ? 'txt' : 'tsv')) {
        languages.add(match[1].toLowerCase());
      }
    }
    return NextResponse.json({ languages: [...languages].sort() });
  } catch {
    return NextResponse.json({ error: 'Unable to list bundled worksheets.' }, { status: 500 });
  }
}
