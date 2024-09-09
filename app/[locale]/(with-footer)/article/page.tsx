import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { headers } from 'next/headers';
import { createClient } from '@/db/supabase/client';
import { getLocale, getTranslations } from 'next-intl/server';

import { RevalidateOneHour } from '@/lib/constants';
import BlogNavCardList from '@/components/blogNav/blogNavCardList';

const ScrollToTop = dynamic(() => import('@/components/page/ScrollToTop'), { ssr: false });

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({
    locale,
    namespace: 'Metadata.article',
  });

  const headersList = headers();
  const host = headersList.get('host') || process.env.NEXT_PUBLIC_SITE_URL || '';
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

  const currentLocale = await getLocale();
  const defaultLocale = 'en'; // 假设默认语言是英语，请根据实际情况调整
  const path = '/article';
  let canonicalUrl = `${protocol}://${host}${path}`;

  // 如果当前语言不是默认语言，则在 URL 中包含语言代码
  if (locale !== defaultLocale) {
    canonicalUrl = `${protocol}://${host}/${currentLocale}${path}`;
  }

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL as string),
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      url: canonicalUrl,
      title: t('title'),
      description: t('description'),
    },
  };
}

export const revalidate = RevalidateOneHour;

export default async function Page() {
  const supabase = createClient();
  const t = await getTranslations('Article');
  const [{ data: blogNavigation }] = await Promise.all([
    supabase.from('blog_navigation').select().order('collection_time', { ascending: false }).limit(48),
  ]);

  return (
    <div className='relative w-full'>
      <div className='relative mx-auto w-full max-w-pc flex-1 px-3 lg:px-0'>
        <div className='my-5 flex flex-col text-center lg:mx-auto lg:my-10 lg:gap-1'>
          <h1 className='text-2xl font-bold text-white lg:text-5xl'>{t('title')}</h1>
          <h2 className='text-balance text-xs font-bold text-white lg:text-sm'>{t('subTitle')}</h2>
        </div>
        <div className='flex flex-col gap-5'>
          {/* <h2 className='text-center text-[18px] lg:text-[32px]'>{t('ai-navigate')}</h2> */}
          <BlogNavCardList dataList={blogNavigation!} />
        </div>
        {/* <Faq /> */}
        <ScrollToTop />
      </div>
    </div>
  );
}
