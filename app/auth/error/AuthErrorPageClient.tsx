'use client';

import Link from 'next/link';

import { URLParamsProvider } from '@settings/URLParams';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import UITextProvider from '../../UITextProvider';

function AuthErrorPageContent() {
  const { uitext } = useInterfaceTranslation();

  return (
    <main className="min-h-screen bg-(--silicon-beige) text-(--silicon-ink) flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-2xl border border-(--silicon-line) bg-white p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.45em] text-(--silicon-purple) font-bold">
          SILICON
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight">
          {uitext('auth.signInErrorTitle')}
        </h1>
        <p className="mt-4 text-(--silicon-ink-soft) leading-relaxed">
          {uitext('auth.signInErrorDescription')}
        </p>
        <Link
          href="/auth/signin"
          className="mt-6 inline-flex rounded-xl bg-(--silicon-brown) px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-(--silicon-purple)"
        >
          {uitext('auth.backToSignIn')}
        </Link>
      </div>
    </main>
  );
}

export default function AuthErrorPageClient() {
  return (
    <URLParamsProvider>
      <UITextProvider>
        <AuthErrorPageContent />
      </UITextProvider>
    </URLParamsProvider>
  );
}
