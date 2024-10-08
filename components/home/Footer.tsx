// import { HTMLAttributeAnchorTarget } from 'react';
// import Link from 'next/link';
import { useTranslations } from 'next-intl';

// import { CONTACT_US_EMAIL } from '@/lib/env';

// function InfoLink({
//   href,
//   title,
//   target,
//   type,
// }: {
//   href: string;
//   title: string;
//   target?: HTMLAttributeAnchorTarget;
//   type?: string;
// }) {
//   return (
//     <Link
//       href={href}
//       title={title}
//       className='whitespace-nowrap text-xs hover:opacity-70 lg:text-sm'
//       target={target}
//       type={type}
//     >
//       {title}
//     </Link>
//   );
// }

export default function Footer() {
  const t = useTranslations('Footer');

  const ContactLinks = [
    {
      title: t('discord'),
      href: 'https://discord.gg/29fuHVjuS7',
    },
  ];

  const SupportLinks = [
    {
      title: t('tap4'),
      href: 'http://tools-ai.xyz',
    },
    {
      title: t('tattoo'),
      href: 'https://www.ubrand.com/',
    },
  ];

  const INFO_LIST = [
    {
      title: t('privacy'),
      href: '/privacy-policy',
    },
    {
      title: t('termsConditions'),
      href: '/terms-of-service',
    },
  ];

  return (
    <footer className='w-full bg-[#15141A]'>
      <div className='mx-auto flex min-h-[251px] max-w-pc flex-col items-center justify-between p-10 pb-5 lg:h-[180px] lg:flex-row lg:px-0 lg:pb-10'>
        <div className='flex flex-col items-center lg:items-stretch'>
          <p className='text-xl font-bold text-white lg:h-8 lg:text-[32px]'>{t('title')}</p>
          <p className='text-xs'>{t('subTitle')}</p>
        </div>
        <div className='mt-5 flex flex-col items-center gap-y-5 lg:mt-0 lg:flex-row lg:items-stretch lg:gap-x-10'>
          <div className='flex w-full flex-col gap-2'>
            <p className='whitespace-nowrap font-bold'>{t('contactUs')}</p>
            {ContactLinks.map((item) => (
              <a
                href={item.href}
                key={item.href}
                target='_blank'
                rel='noreferrer'
                className='text-xs hover:opacity-70 lg:text-sm'
                title={item.title}
              >
                {item.title}
              </a>
            ))}
          </div>
          <div className='flex w-full flex-col gap-2'>
            <p className='whitespace-nowrap font-bold'>{t('support')}</p>
            {SupportLinks.map((item) => (
              <a
                href={item.href}
                key={item.href}
                target='_blank'
                rel='noreferrer'
                className='text-xs hover:opacity-70 lg:text-sm'
                title={item.title}
              >
                {item.title}
              </a>
            ))}
          </div>
          <div className='flex w-full flex-col gap-2'>
            <p className='whitespace-nowrap font-bold'>{t('privacy')}</p>
            {INFO_LIST.map((item) => (
              <a
                href={item.href}
                key={item.href}
                target='_blank'
                rel='noreferrer'
                className='whitespace-nowrap text-xs hover:opacity-70 lg:text-sm'
                title={item.title}
              >
                {item.title}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
