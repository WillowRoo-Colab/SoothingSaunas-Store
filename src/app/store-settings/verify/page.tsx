import { redirect } from "next/navigation";
import { getSessionUser, getAdminProfile } from "@/lib/supabase/auth";
import { isTotpEnrolled } from "@/lib/auth/totp";
import { SubmitButton } from "@/components/admin/SubmitButton";
import {
  sendEnrollmentCode,
  sendLoginCode,
  submitCode,
  submitTotpCode,
} from "./actions";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    sent?: string;
    phone?: string;
    purpose?: string;
  }>;
}) {
  const { error, sent, phone } = await searchParams;

  const user = await getSessionUser();
  if (!user) redirect("/store-settings/login");

  const profile = await getAdminProfile(user.id);
  const needsPhone = !profile?.phoneE164;
  const codeSent = sent === "1";
  const hasTotp = !needsPhone && (await isTotpEnrolled(user.id));

  // Returning admin, not mid-SMS-request, with an authenticator app already
  // set up: that's the default path (no "send" step needed at all — the
  // whole point is it works without depending on Textbelt).
  const showTotpForm = !needsPhone && hasTotp && !codeSent;

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4">
      <h1 className="font-display text-2xl text-charcoal">Verify it&apos;s you</h1>
      <p className="mt-1 text-sm text-charcoal/70">
        {codeSent
          ? "Enter the code we texted you to continue."
          : needsPhone
            ? "Add a phone number to receive a one-time code by text."
            : showTotpForm
              ? "Enter the code from your authenticator app."
              : "We'll text a one-time code to your phone on file."}
      </p>

      {error ? (
        <p
          role="alert"
          className="mt-4 rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </p>
      ) : null}

      {needsPhone && !codeSent ? (
        <form action={sendEnrollmentCode} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="phone" className="text-sm font-medium">
              Phone number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              placeholder="+15555550123"
              defaultValue={phone}
              className="rounded border border-silver px-3 py-2"
            />
            <p className="text-xs text-charcoal/60">
              Include the country code, e.g. +1 for the US.
            </p>
          </div>
          <SubmitButton
            pendingText="Sending…"
            className="mt-2 rounded bg-charcoal px-4 py-2 font-medium text-cream transition-colors hover:bg-charcoal/90 disabled:opacity-60"
          >
            Send code
          </SubmitButton>
        </form>
      ) : null}

      {showTotpForm ? (
        <>
          <form action={submitTotpCode} className="mt-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="totpCode" className="text-sm font-medium">
                6-digit code
              </label>
              <input
                id="totpCode"
                name="code"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                required
                autoFocus
                className="rounded border border-silver px-3 py-2 text-center tracking-[0.3em]"
              />
            </div>
            <SubmitButton
              pendingText="Verifying…"
              className="mt-2 rounded bg-charcoal px-4 py-2 font-medium text-cream transition-colors hover:bg-charcoal/90 disabled:opacity-60"
            >
              Verify
            </SubmitButton>
          </form>

          <form action={sendLoginCode} className="mt-3">
            <SubmitButton
              pendingText="Sending…"
              className="text-sm text-charcoal/70 underline hover:text-charcoal disabled:opacity-60"
            >
              Text me a code instead
            </SubmitButton>
          </form>
        </>
      ) : null}

      {!needsPhone && !hasTotp && !codeSent ? (
        <form action={sendLoginCode} className="mt-6">
          <SubmitButton
            pendingText="Sending…"
            className="rounded bg-charcoal px-4 py-2 font-medium text-cream transition-colors hover:bg-charcoal/90 disabled:opacity-60"
          >
            Text me a code
          </SubmitButton>
        </form>
      ) : null}

      {codeSent ? (
        <>
          <form action={submitCode} className="mt-6 flex flex-col gap-4">
            <input type="hidden" name="purpose" value={needsPhone ? "enroll" : "login"} />
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
            <SubmitButton
              pendingText="Verifying…"
              className="mt-2 rounded bg-charcoal px-4 py-2 font-medium text-cream transition-colors hover:bg-charcoal/90 disabled:opacity-60"
            >
              Verify
            </SubmitButton>
          </form>

          <form action={needsPhone ? sendEnrollmentCode : sendLoginCode} className="mt-3">
            {needsPhone ? <input type="hidden" name="phone" value={phone} /> : null}
            <SubmitButton
              pendingText="Sending…"
              className="text-sm text-charcoal/70 underline hover:text-charcoal disabled:opacity-60"
            >
              Resend code
            </SubmitButton>
          </form>

          {hasTotp ? (
            <a
              href="/store-settings/verify"
              className="mt-2 block text-sm text-charcoal/70 underline hover:text-charcoal"
            >
              Use authenticator app instead
            </a>
          ) : null}
        </>
      ) : null}
    </main>
  );
}
