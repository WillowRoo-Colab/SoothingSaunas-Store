import { getCollectionLeadImage } from "@/lib/shopify/collections";
import { getActiveImage } from "@/lib/images";
import {
  getProductByHandle,
  getProductsByHandles,
} from "@/lib/shopify/products";
import { CinematicHero } from "@/components/homepage/CinematicHero";
import {
  GuidedProductPathways,
  type PathwayCard,
} from "@/components/homepage/GuidedProductPathways";
import { DiscoveryBridge } from "@/components/homepage/DiscoveryBridge";
import { FeaturedExperience } from "@/components/homepage/FeaturedExperience";
import { WellnessGoalGrid } from "@/components/homepage/WellnessGoalGrid";
import { LearningBridgeFeature } from "@/components/homepage/LearningBridgeFeature";
import { CompleteTheRitual } from "@/components/homepage/CompleteTheRitual";
import { TrustAndService } from "@/components/homepage/TrustAndService";
import { JournalFeature } from "@/components/homepage/JournalFeature";
import { WellnessWalletCapture } from "@/components/homepage/WellnessWalletCapture";

// Built from docs/designs/Homepage-Build-Blueprint.md. See completion notes
// for adaptations made where the blueprint's envisioned content didn't have
// a real Shopify match (e.g. the blueprint's Infrared Saunas / Outdoor
// Wellness pathway categories currently have zero products in the catalog,
// so real categories with inventory were substituted).
export default async function Home() {
  const [
    heroImage,
    featuredProduct,
    ritualProducts,
    traditionalImage,
    plungeImage,
    heaterImage,
    accessoryImage,
  ] = await Promise.all([
    getActiveImage("homepage-hero"),
    getProductByHandle("the-palmer-sauna"),
    getProductsByHandles([
      "starter-sauna-accessory-package",
      "sauna-comfort-back-rest",
      "mini-solejoy-foot-massager-base",
      "huum-hive-safety-railing",
    ]),
    getCollectionLeadImage("traditional-saunas"),
    getCollectionLeadImage("plunges"),
    getCollectionLeadImage("wood-burn-heaters"),
    getCollectionLeadImage("accessories-sauna"),
  ]);

  const pathwayCards: PathwayCard[] = [
    {
      label: "Traditional Saunas",
      descriptor: "Timeless heat. A ritual of your own.",
      href: "/collections/traditional-saunas",
      imageUrl: traditionalImage?.url ?? null,
    },
    {
      label: "Cold Plunges",
      descriptor: "Reset through contrast.",
      href: "/collections/plunges",
      imageUrl: plungeImage?.url ?? null,
    },
    {
      label: "Wood-Fired Heat",
      descriptor: "An honest, elemental kind of warmth.",
      href: "/collections/wood-burn-heaters",
      imageUrl: heaterImage?.url ?? null,
    },
    {
      label: "Accessories",
      descriptor: "The small details that complete the room.",
      href: "/collections/accessories-sauna",
      imageUrl: accessoryImage?.url ?? null,
    },
  ];

  return (
    <main id="main-content" className="font-sans">
      {/* Full-bleed backdrop so the sides beyond the hero's 1440px column
          (and the fixed header floating over it) read as dark, not the
          page's cream background — the hero itself is untouched. pb-10
          gives the hero's own gold glow (shadow-[...] in CinematicHero)
          room to fade into the same charcoal below it, continuing the
          glow visible at the hero's sides rather than cutting it off
          with a hard edge. */}
      <div className="bg-charcoal pb-10">
        <CinematicHero
          imageUrl={heroImage?.publicUrl ?? null}
          focalX={heroImage?.focalX}
          focalY={heroImage?.focalY}
        />
      </div>
      <GuidedProductPathways cards={pathwayCards} />
      <DiscoveryBridge />
      <FeaturedExperience
        product={featuredProduct}
        imageUrl={heroImage?.publicUrl ?? null}
      />
      <WellnessGoalGrid />
      <LearningBridgeFeature imageUrl={heroImage?.publicUrl ?? null} />
      <CompleteTheRitual products={ritualProducts} />
      <TrustAndService />
      <JournalFeature bridgeProduct={ritualProducts[2] ?? null} />
      <WellnessWalletCapture />
    </main>
  );
}
