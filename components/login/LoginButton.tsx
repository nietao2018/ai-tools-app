import { useEffect, useState } from 'react';
import Image from 'next/image';
import { signIn } from 'next-auth/react';

export default function LoginButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userAvatar, setUserAvatar] = useState('');

  useEffect(() => {
    // 这里应该检查用户的登录状态
    // 例如,从localStorage或者API获取登录信息
    const checkLoginStatus = () => {
      // 模拟检查登录状态
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(loggedIn);
      if (loggedIn) {
        // 如果登录,获取用户头像
        setUserAvatar(localStorage.getItem('userAvatar') || '/default-avatar.png');
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogin = () => {
    // 这里应该实x现登录逻辑
    signIn();
  };

  return (
    <div>
      {isLoggedIn ? (
        <Image src={userAvatar} alt='用户头像' width={40} height={40} className='rounded-full' />
      ) : (
        <button
          type='button'
          onClick={handleLogin}
          className='rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700'
        >
          登录
        </button>
      )}
    </div>
  );
}
