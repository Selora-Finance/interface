'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components';
import { LiquidityVaultsView } from '@/ui/liquidity/LiquidityVaultsView';
import { useAtom } from 'jotai';
import { themeAtom } from '@/store';
import { Themes } from '@/constants';
import { useRouter } from 'next/navigation';
import { Settings, ChevronLeft } from 'lucide-react';

export default function LiquidityVaultsPage() {
  const [theme] = useAtom(themeAtom);
  const isDarkMode = useMemo(() => theme === Themes.DARK, [theme]);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'stake' | 'unstake'>('stake');

  const handleBack = () => {
    router.back();
  };

  const handleAddLiquidity = () => {
    router.push('/liquidity/deposit');
  };

  const getHeaderText = () => {
    return activeTab === 'stake' ? 'Stake Liquidity' : 'Unstake Liquidity';
  };

  return (
    <div className="flex w-svw flex-1 justify-center items-center flex-col gap-6 py-6 md:py-12 my-36 mx-auto relative px-3">
      {/* Header Section */}
      <div className="w-full md:w-1/4 flex justify-between items-start">
        <div className="flex flex-col gap-3">
          <h2 className={`text-lg md:text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-[#000]'}`}>
            {getHeaderText()}
          </h2>
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-400 transition-colors text-left"
          >
            <ChevronLeft size={16} />
            Back
          </button>
        </div>

        <div className="flex flex-col items-end gap-3">
          <button
            onClick={() => {}}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Settings size={20} color={!isDarkMode ? '#000' : '#fff'} />
          </button>
          <button onClick={handleAddLiquidity} className="text-sm text-gray-500 hover:text-gray-400 transition-colors">
            Add Liquidity
          </button>
        </div>
      </div>

      {/* Main Stake Card */}
      <div className="flex justify-center items-center w-full md:w-1/4">
        <Card
          variant={isDarkMode ? 'neutral' : 'primary'}
          className={`flex justify-center items-start w-full px-6 py-8 ${
            !isDarkMode && 'border border-[#d9d9d9]'
          } text-lg`}
        >
          <LiquidityVaultsView activeTab={activeTab} onTabChange={setActiveTab} />
        </Card>
      </div>
    </div>
  );
}
