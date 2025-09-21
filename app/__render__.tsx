'use client';

import { Tomorrow } from 'next/font/google';
import Footer from '@/ui/Footer';
import Navbar from '@/ui/Navbar';
import { useAtom } from 'jotai';
import { themeAtom } from '@/store';
import { useMemo } from 'react';
import { Themes } from '@/constants';

const tomorrow = Tomorrow({
  variable: '--font-tomorrow',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const AppView: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme] = useAtom(themeAtom);
  const isDarkMode = useMemo(() => theme === Themes.DARK, [theme]);
  return (
    <body
      className={`${
        tomorrow.className
      } antialiased flex w-dvw min-h-dvh flex-col justify-start items-center overflow-x-clip transition-all duration-500 ${
        isDarkMode ? 'bg-[#111111]' : 'bg-[#f5eee8]'
      }`}
    >
      <Navbar defaultBg="bg-transparent" mobileMenuBg={`${isDarkMode ? 'bg-[#211b1b]' : 'bg-[#fff]'}`} />
      <main className="flex-1">{children}</main>
      <Footer />
    </body>
  );
};
