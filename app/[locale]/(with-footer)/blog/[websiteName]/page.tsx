import { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { createClient } from '@/db/supabase/client';
import { getLocale, getTranslations } from 'next-intl/server';

import MarkdownProse from '@/components/MarkdownProse';

export async function generateMetadata({
  params: { locale, websiteName },
}: {
  params: { locale: string; websiteName: string };
}): Promise<Metadata> {
  const supabase = createClient();
  const t = await getTranslations({
    locale,
    namespace: 'Metadata.ai',
  });
  const { data } = await supabase.from('blog_navigation').select().eq('name', websiteName);

  if (!data || !data[0]) {
    notFound();
  }

  const headersList = headers();
  const host = headersList.get('host') || process.env.NEXT_PUBLIC_SITE_URL || '';
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

  const currentLocale = await getLocale();
  const defaultLocale = 'en'; // 假设默认语言是英语，请根据实际情况调整

  let canonicalUrl = `${protocol}://${host}/blog/${websiteName}`;
  if (currentLocale !== defaultLocale) {
    canonicalUrl = `${protocol}://${host}/${currentLocale}/blog/${websiteName}`;
  }

  return {
    title: `${data[0].title} | ${t('titleSubfix')}`,
    description: data[0].content,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${data[0].title} | ${t('titleSubfix')}`,
      description: data[0].content,
      url: canonicalUrl,
      type: 'article',
      images: [
        {
          url: data[0].thumbnail_url || '',
          width: 1200,
          height: 630,
          alt: data[0].title,
        },
      ],
    },
  };
}

export default async function Page({ params: { websiteName } }: { params: { websiteName: string } }) {
  const supabase = createClient();
  const { data: dataList } = await supabase.from('blog_navigation').select().eq('name', websiteName);
  if (!dataList) {
    notFound();
  }
  const data = dataList[0];

  return (
    <div className='w-full'>
      <div className='flex flex-col px-6 py-5 lg:h-[180px] lg:flex-row lg:justify-between lg:px-0 lg:py-10'>
        <div className='flex flex-col items-center lg:items-center'>
          <div className='space-y-1 text-center lg:space-y-3'>
            <h1 className='text-2xl lg:text-5xl'>{data.title}</h1>
            <h2 className='text-xs lg:text-sm'>{data.content}</h2>
          </div>
        </div>
      </div>
      {/* <Separator className='bg-[#010101]' /> */}
      <div className='mb-5 px-3 lg:px-0'>
        <MarkdownProse markdown={data?.detail || ''} />
      </div>
    </div>
  );
}
