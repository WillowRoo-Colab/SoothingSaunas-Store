import { redirect } from "next/navigation";
import QRCode from "qrcode";
import { requireAdminSession } from "@/lib/supabase/auth";
import { getPendingTotpEnrollment } from "@/lib/auth/totp";
import { confirmTotp, cancelTotpSetup } from "./actions";

export default async function TotpSetupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const { profile } = await requireAdminSession();

  const pending = await getPendingTotpEnrollment(profile.userId, profile.email);
  if (!pending) {
    redirect("/store-settings/admin-security/profile");
  }

  const qrDataUrl = await QRCode.toDataURL(pending.otpauthUrl);

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4">
      <h1 className="font-display text-2xl text-charcoal">Set up an authenticator app</h1>
      <p className="mt-1 text-sm text-charcoal/70">
        Scan this with Google Authenticator, 1Password, Authy, or similar,
        then enter the 6-digit code it shows to confirm.
      </p>

      {error ? (
        <p
          role="alert"
          className="mt-4 rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </p>
      ) : null}

      {/* eslint-disable-next-line @next/next/no-img-element -- a locally
          generated data: URI, not an optimizable remote/static asset. */}
      <img
        src={qrDataUrl}
        alt="Scan with your authenticator app"
        className="mx-auto mt-4 h-48 w-48"
      />

      <p className="mt-3 break-all text-center font-mono text-xs text-charcoal/60">
        {pending.secret}
      </p>

      <form action={confirmTotp} className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="code" className="text-sm font-medium">
            6-digit code
          </label>
          <input
            id="code"
            name="code"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            required
            autoFocus
            className="rounded border border-silver px-3 py-2 text-center tracking-[0.3em]"
          />
        </div>
        <button
          type="submit"
          className="rounded bg-charcoal px-4 py-2 text-sm font-medium text-cream transition-colors hover:bg-charcoal/90"
        >
          Confirm
        </button>
      </form>

      <form action={cancelTotpSetup} className="mt-3">
        <button
          type="submit"
          className="text-sm text-charcoal/70 underline hover:text-charcoal"
        >
          Cancel
        </button>
      </form>
    </main>
  );
}
