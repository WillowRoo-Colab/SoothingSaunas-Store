import { getCollectionLeadImage } from "@/lib/shopify/collections";
import { getActiveImage } from "@/lib/images";
import {
  getProductByHandle,
  getProductsByHandles,
} from "@/lib/shopify/products";
import { TestHeader } from "@/components/homepage-test/TestHeader";
import { TestFooter } from "@/components/homepage-test/TestFooter";
import { CinematicHero } from "@/components/homepage-test/CinematicHero";
import {
  GuidedProductPathways,
  type PathwayCard,
} from "@/components/homepage-test/GuidedProductPathways";
import { DiscoveryBridge } from "@/components/homepage-test/DiscoveryBridge";
import { FeaturedExperience } from "@/components/homepage-test/FeaturedExperience";
import { WellnessGoalGrid } from "@/components/homepage-test/WellnessGoalGrid";
import { LearningBridgeFeature } from "@/components/homepage-test/LearningBridgeFeature";
import { CompleteTheRitual } from "@/components/homepage-test/CompleteTheRitual";
import { TrustAndService } from "@/components/homepage-test/TrustAndService";
import { JournalFeature } from "@/components/homepage-test/JournalFeature";
import { WellnessWalletCapture } from "@/components/homepage-test/WellnessWalletCapture";

// Experimental alternate homepage built from
// docs/designs/Homepage-Build-Blueprint.md. Not linked from production nav.
// See completion notes for adaptations made where the blueprint's envisioned
// content didn't have a real Shopify match (e.g. the blueprint's Infrared
// Saunas / Outdoor Wellness pathway categories currently have zero products
// in the catalog, so real categories with inventory were substituted).
export default async function HomepageTestPage() {
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
    <div className="font-sans">
      <TestHeader />
      <main id="main-content">
        <CinematicHero
          imageUrl={heroImage?.publicUrl ?? null}
          focalX={heroImage?.focalX}
          focalY={heroImage?.focalY}
        />
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
      <TestFooter />
    </div>
  );
}
