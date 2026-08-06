import Link from 'next/link';

export default function AuthErrorPage() {
  return (
    <main className="min-h-screen bg-(--silicon-beige) text-(--silicon-ink) flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-2xl border border-(--silicon-line) bg-white p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.45em] text-(--silicon-purple) font-bold">
          SILICON
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight">Sign-in Error</h1>
        <p className="mt-4 text-(--silicon-ink-soft) leading-relaxed">
          Authentication did not complete. Try signing in again, or contact the SILICON team if the
          problem persists.
        </p>
        <Link
          href="/auth/signin"
          className="mt-6 inline-flex rounded-xl bg-(--silicon-brown) px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-(--silicon-purple)"
        >
          Back to sign in
        </Link>
      </div>
    </main>
  );
}
