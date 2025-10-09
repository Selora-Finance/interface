'use client';

import { Card } from '@/components';
import { Themes } from '@/constants';
import { themeAtom } from '@/store';
import { useAtom } from 'jotai';
import { useMemo } from 'react';

const SwapDetails: React.FC = () => {
  const [theme] = useAtom(themeAtom);
  const isDarkMode = useMemo(() => theme === Themes.DARK, [theme]);
  return (
    <div className="flex justify-center items-center w-full md:w-1/4">
      <Card
        variant={isDarkMode ? 'neutral' : 'primary'}
        className={`flex justify-center items-start w-full px-4 py-7 ${
          !isDarkMode && 'border border-[#d9d9d9]'
        } text-lg`}
      >
        <div className="flex flex-col justify-start w-full items-center gap-4">
          <div className="w-full justify-between items-center flex gap-3">
            <span>Slippage Tolerance</span>
            <span>10%</span>
          </div>
          <div className="w-full justify-between items-center flex gap-3">
            <span>Exchange Rate</span>
            <span>--</span>
          </div>
          <div className="w-full justify-between items-center flex gap-3">
            <span>Price Impact</span>
            <span>0%</span>
          </div>
          <div className="w-full justify-between items-center flex gap-3">
            <span>Minimum Received</span>
            <span>--</span>
          </div>
          <div className="w-full justify-between items-center flex gap-3">
            <span>Router</span>
            <span className="text-[#d0de27]">Auto</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SwapDetails;
