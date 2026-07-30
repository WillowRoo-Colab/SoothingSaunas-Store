import Image from "next/image";
import { LearningBridgeCard } from "./LearningBridgeCard";

export function LearningBridgeFeature({
  imageUrl,
}: {
  imageUrl: string | null;
}) {
  return (
    <section className="relative mx-auto max-w-[1440px] overflow-clip bg-charcoal py-24 sm:py-32">
      <div className="absolute inset-0">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-60"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-charcoal/70" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-8">
        <LearningBridgeCard
          label="Did you know?"
          heading="Not all sauna heat feels the same."
          body="Traditional, infrared, and steam systems warm the body and the room differently. The best choice depends on the experience you want, the space you have, and how you plan to use it."
          ctaLabel="Compare sauna types"
          ctaHref="/compare-saunas"
        />
      </div>
    </section>
  );
}
