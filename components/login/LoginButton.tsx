import { useEffect, useState } from 'react';
import Image from 'next/image';
import { signIn, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import { useCommonContext } from '@/app/context/common-context';

export default function LoginButton() {
  const t = useTranslations('Navigation');
  const [userAvatar, setUserAvatar] = useState('');
  const { data: session, status } = useSession();
  // @ts-ignore
  const { setShowLogoutModal } = useCommonContext();

  useEffect(() => {
    if (session?.user?.image) {
      setUserAvatar(session.user.image);
    }
  }, [session]);

  const handleLogin = () => {
    // setShowLoginModal(true);
    signIn();
  };
  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  return (
    <div>
      {status === 'authenticated' ? (
        <Image src={userAvatar} alt='用户头像' width={32} height={32} className='rounded-full' onClick={handleLogout} />
      ) : (
        <button
          type='button'
          onClick={handleLogin}
          className='rounded bg-blue-500 px-3 py-1 font-bold text-white hover:bg-blue-700 lg:h-[32px] lg:w-[80px]'
        >
          {t('login')}
        </button>
      )}
    </div>
  );
}
