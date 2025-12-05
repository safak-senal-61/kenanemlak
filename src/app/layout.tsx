import type { Metadata } from "next";
import { Geist, Geist_Mono, Pinyon_Script } from "next/font/google";
import "./globals.css";

export const dynamic = 'force-dynamic';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pinyonScript = Pinyon_Script({
  variable: "--font-pinyon",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kenan Kadıoğlu Gayrimenkul - Trabzon'un Güvenilir Emlak Danışmanı",
  description: "15 yıllık sektör tecrübesiyle Trabzon ve çevresinde güvenilir, şeffaf ve profesyonel gayrimenkul danışmanlık hizmetleri.",
  keywords: "Trabzon emlak, Trabzon gayrimenkul, Kenan Kadıoğlu, emlak danışmanlığı, satılık daire Trabzon, kiralık daire Trabzon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pinyonScript.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
