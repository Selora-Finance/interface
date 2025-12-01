'use client';

import { useAtom } from 'jotai';
import { Button } from '../../components/Button';
import { themeAtom } from '@/store';
import { useCallback, useMemo } from 'react';
import { Themes } from '@/constants';
import { useRouter } from 'next/navigation';

export default function Hero() {
  const [theme] = useAtom(themeAtom);
  const isDarkMode = useMemo(() => theme === Themes.DARK, [theme]);

  const router = useRouter();

  const openDocs = useCallback(() => {
    if (typeof window !== 'undefined') window.open('https://selora.gitbook.io/selora', '_blank');
  }, []);

  const openTradingPage = useCallback(() => router.push('/swap'), [router]);

  return (
    <>
      <section className="text-center py-14 md:py-12 relative overflow-hidden w-full">
        <div className="absolute top-20 left-2 md:left-1/5 w-32 h-32 md:w-64 md:h-64 bg-orange-600 rounded-full filter blur opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-2 md:right-1/5 w-16 h-16 md:w-32 md:h-32 bg-orange-600 rounded-full filter blur opacity-30 animate-pulse"></div>

        <h1
          className={`text-3xl md:text-5xl font-extrabold max-w-3xl mx-auto ${
            isDarkMode ? 'text-white' : 'text-black'
          }`}
        >
          The Central Trading & Liquidity Marketplace on Fluent
        </h1>
        <p className={`mt-4 text-lg max-w-2xl mx-auto ${isDarkMode ? 'text-white' : 'text-black'}`}>
          Selora is a ve(3,3) AMM powering sustainable liquidity, governance, and incentives on Fluent network.
        </p>

        <div className="mt-6 flex justify-center gap-4 w-full flex-col md:flex-row">
          <Button onClick={openTradingPage} className="w-full md:w-1/7 py-3 cursor-pointer">
            Start Trading
          </Button>
          <Button onClick={openDocs} className="w-full md:w-1/7 py-3 cursor-pointer">
            Read Docs
          </Button>
        </div>
      </section>
    </>
  );
}
