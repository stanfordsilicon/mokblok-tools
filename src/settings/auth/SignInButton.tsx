// The button is the only interactive bit, so it's the only client component —
// the page around it stays a server component.
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
      className="w-full rounded-xl bg-(--silicon-brown) px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-(--silicon-purple) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--silicon-purple) disabled:opacity-60"
    >
      {pending ? 'Redirecting to Google…' : 'Sign in with Google'}
    </button>
  );
}
