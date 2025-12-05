import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import prisma from "@/lib/prisma";
import MaintenancePage from "@/components/MaintenancePage";
import ChatWidget from "@/components/ChatWidget";

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!['en', 'tr', 'ar'].includes(locale)) {
    notFound();
  }

  // Providing all messages to the client
  const messages = await getMessages();

  // Maintenance check logic
  let isMaintenanceMode = false;
  try {
    const settings = await prisma.systemSettings.findFirst();
    isMaintenanceMode = settings?.maintenanceMode || false;
  } catch (error) {
    console.error('Maintenance check failed:', error);
  }

  if (isMaintenanceMode) {
    return <MaintenancePage />;
  }

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      {children}
      <ChatWidget />
    </NextIntlClientProvider>
  );
}
