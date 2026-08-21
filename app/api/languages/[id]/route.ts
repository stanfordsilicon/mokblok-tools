import { NextResponse } from 'next/server';

import { auth } from '../../../../auth';
import { withdrawUserLanguageRequest } from '../../../../src/settings/auth/languages';

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Not signed in' }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const result = await withdrawUserLanguageRequest(userId, id);
    if (!result.ok) {
      return NextResponse.json({ success: false, error: result.error }, { status: result.status });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error withdrawing a language request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove that language request.' },
      { status: 500 },
    );
  }
}
