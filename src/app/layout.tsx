import type { Metadata } from "next";
import { Cormorant_Upright, Lato } from "next/font/google";
import "./globals.css";

// SSES-007: Cormorant Upright (display/brand) + Lato (interface/body)
const cormorantUpright = Cormorant_Upright({
  variable: "--font-cormorant-upright",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Soothing Saunas",
  description:
    "Education-first wellness guidance and gear — saunas, cold plunges, infrared, and recovery essentials.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorantUpright.variable} ${lato.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-charcoal">
        {children}
      </body>
    </html>
  );
}
