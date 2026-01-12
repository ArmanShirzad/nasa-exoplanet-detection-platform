import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "NASA Exoplanet Explorer",
  description: "Discover exoplanets using advanced AI analysis. Upload your astronomical data or enter parameters manually to detect potential planetary companions.",
  keywords: ["NASA", "exoplanet", "space", "astronomy", "AI", "detection", "analysis"],
  authors: [{ name: "NASA Space Apps" }],
  openGraph: {
    title: "NASA Exoplanet Explorer",
    description: "Discover exoplanets using advanced AI analysis",
    type: "website",
  },
  icons: {
    icon: "/nasa-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
