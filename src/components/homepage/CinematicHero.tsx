import Image from "next/image";
import { SsButton } from "./primitives";

export function CinematicHero({
  imageUrl,
  focalX = 70,
  focalY = 50,
}: {
  imageUrl: string | null;
  focalX?: number;
  focalY?: number;
}) {
  return (
    <section className="relative mx-auto flex min-h-[560px] max-w-[1440px] items-end overflow-hidden shadow-[0_0_25px_1px_rgba(201,168,106,0.28)] sm:min-h-[76svh] lg:min-h-[88svh] lg:max-h-[920px]">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: `${focalX}% ${focalY}%` }}
        />
      ) : null}

      {/* Blueprint Section 03 overlay spec: horizontal fade (left-heavy for
          text legibility) + a soft bottom fade. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(21,21,21,.88) 0%, rgba(21,21,21,.58) 42%, rgba(21,21,21,.12) 72%, rgba(21,21,21,.06) 100%), linear-gradient(0deg, rgba(21,21,21,.62) 0%, rgba(21,21,21,0) 48%)",
        }}
      />

      <div className="relative w-full px-4 pb-16 pt-32 sm:px-8 sm:pb-20">
        <div className="max-w-[620px] text-[#f7f1e5]">
          <h1 className="font-display text-[clamp(3rem,2rem+4.2vw,6.5rem)] leading-[0.98]">
            Come home to yourself.
          </h1>
          <p className="mt-5 max-w-[55ch] text-base opacity-90 sm:text-lg">
            Saunas, recovery tools, and restorative rituals chosen to help
            you build a space that feels better to live in.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <SsButton href="/saunas" variant="primary-dark">
              Explore Saunas
            </SsButton>
            <SsButton href="/quiz" variant="outline-dark">
              Find Your Fit
            </SsButton>
          </div>
        </div>
      </div>

      <div
        aria-hidden
        className="absolute bottom-10 right-8 hidden flex-col items-center gap-2 text-[#f7f1e5] sm:flex"
      >
        <span className="text-xs uppercase tracking-[0.15em]">
          Begin your reset
        </span>
        <span className="h-10 w-px bg-gold/60" />
      </div>
    </section>
  );
}
