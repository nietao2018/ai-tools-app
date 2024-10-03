import React from 'react';
import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import { useCommonContext } from '@/app/context/common-context';

export default function LogoutModal() {
  // @ts-ignore
  const { showLogoutModal, setShowLogoutModal } = useCommonContext();
  const t = useTranslations('Navigation');

  const handleLogout = () => {
    sessionStorage.removeItem('user_id');
    signOut();
    setShowLogoutModal(false);
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    showLogoutModal && (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
        <div className='rounded-lg bg-white p-6 shadow-lg lg:h-[200px] lg:w-[400px]'>
          <h2 className='mb-4 text-center text-xl font-bold text-black'>{t('notification')}</h2>
          <p className='text-center text-black lg:mb-[40px]'>{t('logoutText')}</p>
          <div className='flex items-end justify-around'>
            <button
              type='button'
              className='mr-2 rounded bg-gray-200 px-4 py-2 lg:w-[120px]'
              onClick={handleCancelLogout}
            >
              {t('cancel')}
            </button>
            <button
              type='button'
              className='rounded bg-red-500 px-4 py-2 text-white lg:w-[120px]'
              onClick={handleLogout}
            >
              {t('logout')}
            </button>
          </div>
        </div>
      </div>
    )
  );
}
