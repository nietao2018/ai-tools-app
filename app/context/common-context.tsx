'use client';

import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { useInterval } from 'ahooks';
import { useSession } from 'next-auth/react';

interface CommonContextType {
  userData: any;
  setUserData: React.Dispatch<React.SetStateAction<any>>;
  showLoginModal: boolean;
  setShowLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
  showLogoutModal: boolean;
  setShowLogoutModal: React.Dispatch<React.SetStateAction<boolean>>;
  showLoadingModal: boolean;
  setShowLoadingModal: React.Dispatch<React.SetStateAction<boolean>>;
  showGeneratingModal: boolean;
  setShowGeneratingModal: React.Dispatch<React.SetStateAction<boolean>>;
  showPricingModal: boolean;
  setShowPricingModal: React.Dispatch<React.SetStateAction<boolean>>;
}
const CommonContext = createContext<CommonContextType | undefined>(undefined);

export function CommonProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState({});
  const [intervalUserData, setIntervalUserData] = useState(1000);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showGeneratingModal, setShowGeneratingModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);

  const contextValue = useMemo(
    () => ({
      userData,
      setUserData,
      showLoginModal,
      setShowLoginModal,
      showLogoutModal,
      setShowLogoutModal,
      showLoadingModal,
      setShowLoadingModal,
      showGeneratingModal,
      setShowGeneratingModal,
      showPricingModal,
      setShowPricingModal,
    }),
    [userData, showLoginModal, showLogoutModal, showLoadingModal, showGeneratingModal, showPricingModal],
  );

  async function init() {
    if (status === 'authenticated') {
      const loginData = {
        // @ts-ignore
        user_id: session?.user?.user_id,
        name: session?.user?.name,
        email: session?.user?.email,
        image: session?.user?.image,
      };
      setUserData(loginData);
      setShowLoginModal(false);
      // @ts-ignore
      setIntervalUserData(undefined);
    }
  }

  useInterval(() => {
    init();
  }, intervalUserData);

  return <CommonContext.Provider value={contextValue}>{children}</CommonContext.Provider>;
}

export const useCommonContext = () => useContext(CommonContext);
