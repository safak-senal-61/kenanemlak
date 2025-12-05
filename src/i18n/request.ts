import {getRequestConfig} from 'next-intl/server';
import {headers} from 'next/headers';

export default getRequestConfig(async () => {
  const requestHeaders = await headers();
  const locale = requestHeaders.get('X-NEXT-INTL-LOCALE') || 'tr';

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
