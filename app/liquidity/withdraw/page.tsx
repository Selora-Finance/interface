'use client';

import { useMemo } from 'react';
import { Card } from '@/components';
import { LiquidityWithdrawView } from '@/ui/liquidity/LiquidityWithdrawView';
import { useAtom } from 'jotai';
import { themeAtom } from '@/store';
import { Themes } from '@/constants';
import { useRouter } from 'next/navigation';
import { Settings, ChevronLeft } from 'lucide-react';

export default function LiquidityWithdrawPage() {
  const [theme] = useAtom(themeAtom);
  const isDarkMode = useMemo(() => theme === Themes.DARK, [theme]);
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleManagePositions = () => {
    router.push('/liquidity/positions');
  };

  return (
    <div className="flex w-svw flex-1 justify-center items-center flex-col gap-6 py-6 md:py-12 my-36 mx-auto relative px-3">
      {/* Header Section */}
      <div className="w-full md:w-1/4 grid grid-cols-2 gap-y-3">
        {/* Row 1: Title (left) and Settings (right) */}
        <h2 className={`text-lg md:text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>
          Remove Liquidity
        </h2>
        <div className="flex justify-end">
          <button
            onClick={() => {}}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Settings size={20} color={!isDarkMode ? '#000' : '#fff'} />
          </button>
        </div>

        {/* Row 2: Back (left) and Manage Positions (right) */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-400 transition-colors text-left"
        >
          <ChevronLeft size={16} />
          Back
        </button>
        <div className="flex justify-end">
          <button
            onClick={handleManagePositions}
            className="text-sm text-gray-500 hover:text-gray-400 transition-colors"
          >
            Manage Positions
          </button>
        </div>
      </div>

      {/* Main Withdraw Card */}
      <div className="flex justify-center items-center w-full md:w-1/4">
        <Card
          variant={isDarkMode ? 'neutral' : 'primary'}
          className={`flex justify-center items-start w-full px-6 py-8 ${
            !isDarkMode && 'border border-[#d9d9d9]'
          } text-lg`}
        >
          <LiquidityWithdrawView />
        </Card>
      </div>
    </div>
  );
}
