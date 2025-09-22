'use client';

import { useAtom } from 'jotai';
import { Button } from '../../components/Button';
import { themeAtom } from '@/store';
import { useMemo, useState } from 'react';
import { Themes } from '@/constants';
import { Modal } from '@/components';
import WaitlistForm from './WaitlistForm';

export default function Hero() {
  const [theme] = useAtom(themeAtom);
  const isDarkMode = useMemo(() => theme === Themes.DARK, [theme]);
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  return (
    <>
      <section className="text-center py-20 md:py-44 relative overflow-hidden w-full">
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
          <Button onClick={() => setShowWaitlistModal(true)} className="w-full md:w-1/7 py-3">
            Join Waitlist
          </Button>
          <Button className="w-full md:w-1/7 py-3">Read Docs</Button>
        </div>
      </section>
      <Modal isOpen={showWaitlistModal} onClose={() => setShowWaitlistModal(false)}>
        <WaitlistForm />
      </Modal>
    </>
  );
}
