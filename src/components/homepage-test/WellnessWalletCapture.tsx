"use client";

import { useState } from "react";
import { Eyebrow } from "./primitives";

// Security note (SSES-013): this form is intentionally NOT wired to any
// submission endpoint. Capturing real guest emails needs a reviewed data
// path (e.g. Klaviyo) before this is live — until then, submitting must not
// silently appear to succeed while doing nothing with the data.
export function WellnessWalletCapture() {
  const [emailEntered, setEmailEntered] = useState(false);

  return (
    <section className="bg-charcoal py-20 text-[#f7f1e5] sm:py-28">
      <div className="mx-auto max-w-xl px-4 text-center sm:px-8">
        <Eyebrow>Wellness Wallet</Eyebrow>
        <h2 className="mt-3 font-heading text-3xl sm:text-4xl">
          A little more room to build your reset.
        </h2>
        <p className="mt-4 text-base opacity-90">
          Get thoughtful product guidance, new educational resources, and
          opportunities to earn Wellness Wallet credit.
        </p>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="mt-8 flex flex-col gap-3"
        >
          <input
            type="email"
            required
            placeholder="Email address"
            onChange={(e) => setEmailEntered(e.target.value.length > 0)}
            className="rounded-full border border-cream/30 bg-transparent px-5 py-3 text-center text-sm text-[#f7f1e5] placeholder:text-[#f7f1e5]/50 focus-visible:border-gold focus-visible:outline-none"
          />
          {emailEntered ? (
            <input
              type="tel"
              placeholder="Phone number (optional)"
              className="rounded-full border border-cream/30 bg-transparent px-5 py-3 text-center text-sm text-[#f7f1e5] placeholder:text-[#f7f1e5]/50 focus-visible:border-gold focus-visible:outline-none"
            />
          ) : null}
          <p className="px-4 text-xs opacity-60">
            By joining, you agree to receive wellness guidance and marketing
            emails from Soothing Saunas. Unsubscribe anytime.
          </p>
          <button
            type="submit"
            className="mt-1 min-h-12 rounded-full bg-cream px-6 text-sm font-bold text-charcoal transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-gold-400"
          >
            Join the list
          </button>
        </form>
      </div>
    </section>
  );
}
