import { NextIntlClientProvider, useMessages } from 'next-intl';

import { Toaster } from '@/components/ui/sonner';
import Navigation from '@/components/home/Navigation';

import './globals.css';

import { Suspense } from 'react';
import { ProxyAgent, setGlobalDispatcher } from 'undici';

import GoogleAdScript from '@/components/ad/GoogleAdScript';
import SeoScript from '@/components/seo/SeoScript';

import { CommonProvider } from '../context/common-context';
import NextAuthProvider from '../context/next-auth-context';
import Loading from './loading';

if (process.env.LOCAL_FETCH_HOST && process.env.NODE_ENV !== 'production') {
  setGlobalDispatcher(new ProxyAgent(process.env.LOCAL_FETCH_HOST));
}

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = useMessages();

  return (
    <html lang={locale} suppressHydrationWarning className='dark'>
      <body className='bg-tap4-black relative mx-auto flex min-h-screen flex-col text-white'>
        <NextAuthProvider>
          <CommonProvider>
            <NextIntlClientProvider locale={locale} messages={messages}>
              <Toaster
                position='top-center'
                toastOptions={{
                  classNames: {
                    error: 'bg-red-400',
                    success: 'text-green-400',
                    warning: 'text-yellow-400',
                    info: 'bg-blue-400',
                  },
                }}
              />
              <Navigation />
              <Suspense fallback={<Loading />}>{children}</Suspense>
            </NextIntlClientProvider>
          </CommonProvider>
        </NextAuthProvider>
        <SeoScript />
        <GoogleAdScript />
      </body>
    </html>
  );
}
