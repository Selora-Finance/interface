'use client';

import { Card } from '@/components';
import { MAX_SCREEN_SIZES, Themes } from '@/constants';
import { themeAtom } from '@/store';
import { AssetType } from '@/typings';
import { useAtom } from 'jotai';
import { useMemo } from 'react';
import { useWindowDimensions } from '@/hooks/utils';

interface StandardLiquidityDetailsProps {
  asset0?: AssetType | null;
  asset1?: AssetType | null;
  amount0?: string;
  amount1?: string;
  poolType?: 'volatile' | 'stable';
}

const StandardLiquidityDetails: React.FC<StandardLiquidityDetailsProps> = ({
  asset0,
  asset1,
  amount0 = '0',
  amount1 = '0',
}) => {
  const [theme] = useAtom(themeAtom);
  const isDarkMode = useMemo(() => theme === Themes.DARK, [theme]);
  const dimensions = useWindowDimensions();
  const isMobile = useMemo(() => dimensions.width && dimensions.width <= MAX_SCREEN_SIZES.MOBILE, [dimensions.width]);

  // Calculate ratio (assuming amount0 = 1 for display)
  const ratio = useMemo(() => {
    if (!asset0 || !asset1) return '--';
    const amt0 = parseFloat(amount0) || 1;
    const amt1 = parseFloat(amount1) || 0;
    const ratio = amt0 > 0 ? amt1 / amt0 : 0;
    return `1 ${asset0.symbol} : ${ratio.toFixed(2)} ${asset1.symbol}`;
  }, [asset0, asset1, amount0, amount1]);

  return (
    <div className="flex justify-center items-start w-full md:w-1/4">
      <Card
        variant={isDarkMode ? 'neutral' : 'primary'}
        className={`flex justify-center items-start w-full px-4 md:px-6 py-6 md:py-8 ${
          !isDarkMode && 'border border-[#d9d9d9]'
        } ${isMobile ? 'text-base' : 'text-lg'}`}
      >
        <div className="flex flex-col justify-start w-full items-center gap-6">
          {/* Add Liquidity Ratio */}
          <div className="w-full flex justify-between items-center gap-3">
            <span className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-500`}>Add Liquidity Ratio</span>
            <span className={`${isMobile ? 'text-base' : 'text-lg'} font-normal`}>{ratio}</span>
          </div>

          {/* Divider */}
          <hr className={`w-full ${isDarkMode ? 'border-[#333333]' : 'border-[#d9d9d9]'}`} />

          {/* Allowances */}
          <div className="w-full flex flex-col gap-4">
            <span className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-500`}>Allowances</span>
            <div className="flex flex-col gap-3">
              <div className="w-full justify-between items-center flex gap-3">
                <span className={`${isMobile ? 'text-sm' : 'text-base'}`}>{asset0?.symbol || 'Token'} Allowance:</span>
                <span className={`${isMobile ? 'text-sm' : 'text-base'}`}>0.000</span>
              </div>
              <div className="w-full justify-between items-center flex gap-3">
                <span className={`${isMobile ? 'text-sm' : 'text-base'}`}>{asset1?.symbol || 'Token'} Allowance:</span>
                <span className={`${isMobile ? 'text-sm' : 'text-base'}`}>0.000</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StandardLiquidityDetails;
