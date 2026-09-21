import Link from 'next/link';

import { requireRole } from '../../../src/settings/auth/roles';

import WorksheetManager from './WorksheetManager';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default async function WorksheetsPage() {
  const access = await requireRole('admin');
  return (
    <main className="mx-auto max-w-5xl space-y-6 p-6">
      <Link href="/">← Back to review</Link>
      <h1 className="text-3xl font-bold">Review worksheets</h1>
      {access.ok ? (
        <WorksheetManager />
      ) : (
        <p role="alert">
          {access.error}. <Link href="/auth/signin">Sign in</Link>
        </p>
      )}
    </main>
  );
}
