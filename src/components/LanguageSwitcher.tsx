'use client';

import {useLocale, useTranslations} from 'next-intl';
import {useRouter, usePathname} from '@/i18n/routing';
import {ChangeEvent, useTransition} from 'react';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const t = useTranslations('LanguageSwitcher');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    startTransition(() => {
      router.replace(pathname, {locale: nextLocale});
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <Globe className="w-4 h-4 text-white/80" />
      <select
        defaultValue={locale}
        className="bg-transparent text-sm font-medium text-white/90 hover:text-white focus:outline-none cursor-pointer [&>option]:text-black"
        onChange={onSelectChange}
        disabled={isPending}
      >
        <option value="tr">{t('tr')}</option>
        <option value="en">{t('en')}</option>
        <option value="ar">{t('ar')}</option>
      </select>
    </div>
  );
}
