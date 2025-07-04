import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import React from "react";

// Using Poppins as a substitute for Kievit since Kievit is not available in Google Fonts
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

// For testimonial quotes as specified in the PRD
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "EasyMarketplace",
  description: "EasyMarketplace",
  keywords: "EasyMarketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${poppins.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
