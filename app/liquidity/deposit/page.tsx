'use client';

import { useMemo } from 'react';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { Card } from '@/components';
import { Themes, MAX_SCREEN_SIZES } from '@/constants';
import { themeAtom } from '@/store';
import { useWindowDimensions } from '@/hooks/utils';

export default function LiquidityDeposit() {
  const router = useRouter();
  const [theme] = useAtom(themeAtom);
  const isDarkMode = useMemo(() => theme === Themes.DARK, [theme]);
  const dimensions = useWindowDimensions();
  const isMobile = useMemo(() => dimensions.width && dimensions.width <= MAX_SCREEN_SIZES.MOBILE, [dimensions.width]);

  const poolTypes = [
    {
      title: 'Standard Pools',
      description: 'Add or remove liquidity from standard stable and volatile pools',
      onClick: () => {
        router.push('/liquidity/deposit/standard');
      },
    },
    {
      title: 'Concentrated Pools',
      description: 'Provide liquidity within a specific price range for higher efficiency',
      onClick: () => {
        router.push('/liquidity/deposit/concentrated');
      },
    },
  ];

  return (
    <div className="flex w-full flex-1 justify-center items-center py-6 md:py-12 my-24 md:my-36 mx-auto relative px-3 md:px-6 max-w-[90rem]">
      <Card
        variant={isDarkMode ? 'neutral' : 'primary'}
        className={`flex flex-col gap-8 md:gap-12 w-full px-4 md:px-12 py-6 md:py-16 ${
          !isDarkMode && 'border border-[#d9d9d9]'
        }`}
      >
        {/* Header */}
        <h1 className={`${isMobile ? 'text-xl' : 'text-3xl md:text-4xl'} font-normal`}>Manage or Add Liquidity</h1>

        {/* Pool Type Selection */}
        <div className="flex flex-col gap-4 w-full">
          <span className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-500`}>Select Liquidity Type</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {poolTypes.map((type, index) => (
              <Card
                key={index}
                variant={isDarkMode ? 'neutral' : 'primary'}
                className={`flex flex-col gap-4 px-6 md:px-8 py-8 md:py-10 cursor-pointer transition-all hover:scale-[1.02] ${
                  !isDarkMode && 'border border-[#d9d9d9]'
                } ${
                  isDarkMode
                    ? 'hover:border-[#d0de27] border border-[#333333]'
                    : 'hover:border-orange-600 hover:shadow-lg'
                }`}
                onClick={type.onClick}
              >
                <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-semibold`}>{type.title}</h2>
                <p className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-500 leading-relaxed`}>
                  {type.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
