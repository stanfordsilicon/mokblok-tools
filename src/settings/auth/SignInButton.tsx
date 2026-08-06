'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function SignInButton({ callbackUrl }: { callbackUrl?: string }) {
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        setPending(true);
        // callbackUrl comes from proxy.ts, so people land on the level they
        // originally asked for instead of being dumped on the home page.
        signIn('google', { callbackUrl: callbackUrl ?? '/' });
      }}
    >
      {pending ? 'Redirecting to Google…' : 'Sign in with Google'}
    </button>
  );
}
