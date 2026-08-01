import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story — Soothing Saunas",
  description:
    "Founded by a Registered Nurse, Soothing Saunas offers premium wellness devices that support a holistic, education-first approach to health.",
};

const BODY_PARAGRAPHS = [
  "Welcome to Soothing Saunas, where we believe in a holistic approach to health and wellness. Founded by a Registered Nurse with nearly a decade of experience in the healthcare field, our mission is to empower individuals to take charge of their well-being through natural and effective therapies.",
  "After witnessing countless patients struggling with chronic physical pain & plateaued mental health outcomes, it became clear to me that traditional treatment methods often focus solely on symptom management instead of root cause correction. I grew frustrated watching the system's over-reliance on prescribing pharmaceuticals as first-line treatment while overlooking more natural remedies that were available. This motivated me to create a company dedicated to offering high-quality, affordable wellness devices that complement existing care plans and promote a more balanced approach to health.",
  "At Soothing Saunas, we specialize in premium saunas designed to enhance your overall wellness experience and plan to expand our services to include additional types of devices in the future. Our products are carefully curated to support detoxification, relaxation, and rejuvenation. By integrating these holistic therapies into your daily routine, we aim to help you not only feel better but also thrive in all aspects of your life.",
  "We understand that true health goes beyond just physical wellness; it encompasses mental, emotional, and spiritual well-being. That's why we're committed to providing resources and support that empower you to make informed decisions about your health journey. Our team is passionate about educating our community on the benefits of natural therapies and fostering an environment where everyone feels valued and understood.",
  "Whether you're seeking relief from stress, looking to improve your physical health, or simply wanting to create a tranquil space for self-care, we're here to guide you every step of the way. Join us in embracing a healthier, more balanced lifestyle—because your wellness deserves more than just symptom management; it deserves a holistic approach.",
  "Discover the transformative power of sauna therapy with Soothing Saunas and take the first step towards a healthier, happier you.",
];

export default function AboutPage() {
  return (
    <main id="main-content" className="bg-charcoal py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-gold">
          About Us
        </p>
        <h1 className="mt-3 font-display text-4xl text-cream sm:text-5xl">
          Our Story
        </h1>

        <div className="mt-8 space-y-6 text-base leading-relaxed text-cream/90">
          {BODY_PARAGRAPHS.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </main>
  );
}
