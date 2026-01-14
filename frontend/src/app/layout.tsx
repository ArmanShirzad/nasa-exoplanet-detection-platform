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
    icon: [
      { url: "/favicon.ico?v=2", sizes: "32x32", type: "image/x-icon" },
      { url: "/favicon.png?v=2", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico?v=2",
    apple: { url: "/favicon.png?v=2", sizes: "180x180", type: "image/png" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico?v=2" />
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon.png?v=2" />
        <link rel="apple-touch-icon" href="/favicon.png?v=2" />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
