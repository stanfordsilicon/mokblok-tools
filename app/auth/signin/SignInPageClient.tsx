'use client';

import { useSearchParams } from 'next/navigation';

import SignInButton from '@settings/auth/SignInButton';
import { URLParamsProvider } from '@settings/URLParams';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import UITextProvider from '../../UITextProvider';

function SignInPageContent() {
  const searchParams = useSearchParams();
  const { uitext } = useInterfaceTranslation();
  const callbackUrl = searchParams.get('callbackUrl') ?? undefined;
  const error = searchParams.get('error');
  const errorMessage = error
    ? uitext(`auth.errors.${error}`, uitext('auth.signInDidNotCompleteFallback'))
    : null;

  return (
    <main className="min-h-screen bg-(--silicon-beige) text-(--silicon-ink) flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <p className="text-xs uppercase tracking-[0.45em] text-(--silicon-purple) font-bold">
          SILICON
        </p>

        <h1 className="mt-3 text-3xl md:text-4xl font-black tracking-tight">{uitext('title')}</h1>

        <p className="mt-4 text-(--silicon-ink-soft) leading-relaxed">{uitext('auth.signInWhy')}</p>

        <div className="mt-6 rounded-2xl border border-(--silicon-line) bg-white p-6 shadow-sm">
          {errorMessage && (
            <div
              role="alert"
              className="mb-4 rounded-xl border border-(--silicon-line-strong) bg-(--silicon-panel) p-4 text-sm text-(--silicon-ink)"
            >
              <p className="font-semibold">{uitext('auth.signInDidNotCompleteTitle')}</p>
              <p className="mt-1 text-(--silicon-ink-soft)">{errorMessage}</p>
            </div>
          )}
          <SignInButton callbackUrl={callbackUrl} />
        </div>
      </div>
    </main>
  );
}

export default function SignInPageClient() {
  return (
    <URLParamsProvider>
      <UITextProvider>
        <SignInPageContent />
      </UITextProvider>
    </URLParamsProvider>
  );
}
