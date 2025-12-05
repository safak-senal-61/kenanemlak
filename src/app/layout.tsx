import type { Metadata } from "next";
import { Geist, Geist_Mono, Pinyon_Script } from "next/font/google";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import MaintenancePage from "@/components/MaintenancePage";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Bakım modu kontrolü
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  
  let isMaintenanceMode = false;
  try {
    const settings = await prisma.systemSettings.findFirst();
    isMaintenanceMode = settings?.maintenanceMode || false;
  } catch (error) {
    console.error('Maintenance check failed:', error);
  }

  // Admin paneli ve API rotaları bakım modundan etkilenmemeli
  const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/api');
  
  // Bakım modu aktifse ve admin rotasında değilsek bakım sayfasını göster
  const shouldShowMaintenance = isMaintenanceMode && !isAdminRoute;

  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pinyonScript.variable} antialiased`}
      >
        {shouldShowMaintenance ? (
          <MaintenancePage />
        ) : (
          <>
            {children}
            {/* ChatWidget sadece admin rotasında değilse gösterilsin */}
            {!isAdminRoute && <ChatWidget />}
          </>
        )}
      </body>
    </html>
  );
}
