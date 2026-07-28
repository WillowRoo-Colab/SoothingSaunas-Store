"use client";

import { useState } from "react";
import Link from "next/link";
import { Eyebrow, SsButton } from "./primitives";

const QUESTIONS = [
  "What are you hoping to improve?",
  "Where will your setup live?",
  "What kind of experience feels right?",
] as const;

export function DiscoveryBridge() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <section className="relative overflow-clip bg-cream pb-20 pt-24 text-charcoal sm:pb-28 sm:pt-32">
      {/* Curved rise from the charcoal section above, instead of a hard cut. */}
      <div
        aria-hidden
        className="absolute inset-x-0 -top-1 h-16 bg-charcoal"
        style={{ clipPath: "ellipse(60% 100% at 50% 0%)" }}
      />

      <div className="relative mx-auto grid max-w-[1440px] gap-12 px-4 sm:px-8 lg:grid-cols-2 lg:items-center">
        <div>
          <Eyebrow>Not sure where to start?</Eyebrow>
          <h2 className="mt-3 font-heading text-3xl sm:text-4xl">
            How can we help you feel better?
          </h2>
          <p className="mt-4 max-w-[55ch] text-base text-charcoal/80">
            Tell us what you want more of—rest, recovery, warmth, energy,
            privacy, or a better daily ritual—and we&apos;ll help narrow the
            options.
          </p>
        </div>

        <div className="rounded-2xl border border-gold/40 bg-charcoal p-6 text-[#f7f1e5] shadow-[var(--tw-shadow,0_28px_80px_rgba(0,0,0,0.34))] sm:p-8">
          <ul className="flex flex-col gap-3">
            {QUESTIONS.map((q) => (
              <li key={q}>
                <button
                  type="button"
                  onClick={() => setSelected(q)}
                  aria-pressed={selected === q}
                  className={`w-full rounded-full border px-5 py-3 text-left text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-gold-400 ${
                    selected === q
                      ? "border-gold bg-cream text-charcoal"
                      : "border-cream/30 bg-transparent text-[#f7f1e5] hover:border-gold/70"
                  }`}
                >
                  {q}
                </button>
              </li>
            ))}
          </ul>

          <SsButton
            href="/homepage-test/quiz"
            variant="primary-dark"
            className="mt-6 w-full"
          >
            Take the 3-question quiz
          </SsButton>
          <Link
            href="/homepage-test/compare-saunas"
            className="mt-4 block text-center text-sm text-[#f7f1e5]/80 underline decoration-gold/40 underline-offset-4 hover:text-gold"
          >
            Compare sauna types instead
          </Link>
        </div>
      </div>
    </section>
  );
}
