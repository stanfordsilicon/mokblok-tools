import SignInButton from '../../../src/settings/auth/SignInButton';

const ERROR_MESSAGES: Record<string, string> = {
  AccessDenied:
    "That Google account isn't on the invited list for this tool. Contact the SILICON team to have it added.",
  Configuration:
    "The server's sign-in configuration is incomplete. This is our problem, not yours.",
  OAuthAccountNotLinked:
    'That email is already registered through a different sign-in method. Use the original method.',
  OAuthSignin: "Couldn't start the Google sign-in. Please try again.",
  OAuthCallback: 'Google returned an unexpected response. Please try again.',
  OAuthCreateAccount: "Couldn't create your account record. Please try again.",
  Callback: 'Something went wrong finishing sign-in. Please try again.',
  Verification: 'That sign-in link has expired or was already used.',
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const { callbackUrl, error } = await searchParams;
  const errorMessage = error
    ? (ERROR_MESSAGES[error] ??
      "Sign-in didn't complete. Please try again, or contact the SILICON team.")
    : null;

  return (
    <main className="min-h-screen bg-(--silicon-beige) text-(--silicon-ink) flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <p className="text-xs uppercase tracking-[0.45em] text-(--silicon-purple) font-bold">
          SILICON
        </p>

        <h1 className="mt-3 text-3xl md:text-4xl font-black tracking-tight">Mokblok Tools</h1>

        <p className="mt-4 text-(--silicon-ink-soft) leading-relaxed">
          Sign in with your approved Google account to use the translation and review tools.
        </p>

        <div className="mt-6 rounded-2xl border border-(--silicon-line) bg-white p-6 shadow-sm">
          {errorMessage && (
            <div
              role="alert"
              className="mb-4 rounded-xl border border-(--silicon-line-strong) bg-(--silicon-panel) p-4 text-sm text-(--silicon-ink)"
            >
              <p className="font-semibold">Sign-in didn&apos;t complete</p>
              <p className="mt-1 text-(--silicon-ink-soft)">{errorMessage}</p>
            </div>
          )}
          <SignInButton callbackUrl={callbackUrl} />
        </div>
      </div>
    </main>
  );
}
