import type { ScrollingTicker as ScrollingTickerData } from "@/lib/scrollingTickers";

const FONT_COLOR_CLASSES: Record<ScrollingTickerData["fontColor"], string> = {
  charcoal: "text-charcoal",
  cream: "text-cream",
  gold: "text-gold",
  silver: "text-silver",
};

const FONT_FAMILY_CLASSES: Record<ScrollingTickerData["fontFamily"], string> = {
  display: "font-display",
  sans: "font-sans",
  heading: "font-heading",
};

function Divider({ ticker }: { ticker: ScrollingTickerData }) {
  if (ticker.dividerType === "image" && ticker.dividerImageUrl) {
    // Tiny inline divider glyph repeated many times in a row — not a page
    // asset worth next/image's optimization pipeline.
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={ticker.dividerImageUrl}
        alt=""
        aria-hidden
        className="mx-4 inline-block h-[1em] w-[1em] shrink-0 align-middle"
      />
    );
  }

  return (
    <span aria-hidden className="mx-4 inline-block shrink-0 align-middle opacity-70">
      {ticker.dividerCharacter || "•"}
    </span>
  );
}

// Pure presentational — takes a fully-resolved ticker config and renders
// it. No data fetching of its own; callers (any page) fetch by placement
// key via getTickerByPlacement and pass the result in. Renders nothing if
// there are no messages, so a misconfigured/empty instance never shows an
// empty scrolling bar.
export function ScrollingTicker({ ticker }: { ticker: ScrollingTickerData }) {
  if (!ticker.enabled || ticker.messages.length === 0) return null;

  const style =
    ticker.widthMode === "custom" && ticker.widthValue
      ? { width: ticker.widthValue, maxWidth: "100%" }
      : undefined;

  const sequence = (
    <>
      {ticker.messages.map((message) => (
        <span key={message.id} className="inline-flex shrink-0 items-center whitespace-nowrap">
          {message.text}
          <Divider ticker={ticker} />
        </span>
      ))}
    </>
  );

  return (
    <div
      style={style}
      className={`overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] ${FONT_COLOR_CLASSES[ticker.fontColor]} ${FONT_FAMILY_CLASSES[ticker.fontFamily]}`}
    >
      <div
        className="ticker-track flex w-max"
        style={{ "--ticker-duration": `${ticker.scrollSpeedSeconds}s`, fontSize: ticker.fontSizePx } as React.CSSProperties}
      >
        <div className="flex shrink-0">{sequence}</div>
        <div aria-hidden className="flex shrink-0">
          {sequence}
        </div>
      </div>
    </div>
  );
}
