import { signIn } from "./actions";
import { SubmitButton } from "@/components/admin/SubmitButton";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4">
      <h1 className="font-display text-2xl text-charcoal">Store Settings</h1>
      <p className="mt-1 text-sm text-charcoal/70">Admin sign-in</p>

      {error ? (
        <div role="alert" className="mt-4 flex flex-col gap-2">
          <p className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
          <p className="rounded border border-charcoal/20 bg-charcoal/5 px-3 py-2 text-xs text-charcoal/70">
            This area is restricted to authorized users only. Any attempt to
            gain unauthorized access is prohibited. Sign-in attempts are
            logged, including IP address, approximate location, and
            device/browser information.
          </p>
        </div>
      ) : null}

      <form action={signIn} className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="username"
            className="rounded border border-silver px-3 py-2"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="rounded border border-silver px-3 py-2"
          />
        </div>

        <SubmitButton
          pendingText="Signing in…"
          className="mt-2 rounded bg-charcoal px-4 py-2 font-medium text-cream transition-colors hover:bg-charcoal/90 disabled:opacity-60"
        >
          Sign in
        </SubmitButton>
      </form>

      <a
        href="/store-settings/reset-password"
        className="mt-4 text-sm text-charcoal/70 underline hover:text-charcoal"
      >
        Forgot password?
      </a>
    </main>
  );
}
