import { Playfair_Display } from "next/font/google";

// Experimental page only — see docs/designs/Homepage-Build-Blueprint.md.
// Playfair Display is scoped to this route so production font-loading
// budgets (SSES-012) are unaffected.
const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export default function HomepageTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${playfairDisplay.variable} bg-charcoal`}>
      {children}
    </div>
  );
}
