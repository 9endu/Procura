import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Procura — Collective Buying. Smarter Margins.",
  description: "AI-assisted pooled wholesale buying platform. Join buying pools to unlock wholesale prices and smarter margins for your business.",
  keywords: ["wholesale", "group buying", "procurement", "B2B", "bulk discounts"],
  openGraph: {
    title: "Procura",
    description: "Collective Buying. Smarter Margins.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark`} suppressHydrationWarning>
      <body className="min-h-screen bg-[#09090b] text-zinc-100 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
