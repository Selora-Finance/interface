'use client';

import { Button } from '@/components';
import { MAX_SCREEN_SIZES } from '@/constants';
import { useMemo } from 'react';
import { useWindowDimensions } from '@/hooks/utils';
import { formatNumber } from '@/lib/client/utils';

interface LiquidityHeroProps {
  totalPools?: number | string;
  tvl?: number | string;
  fees?: number | string;
  volume?: number | string;
  onDepositClick?: () => void;
}

const LiquidityHero: React.FC<LiquidityHeroProps> = ({
  totalPools = 0,
  tvl = 0,
  fees = 0,
  volume = 0,
  onDepositClick,
}) => {
  const dimensions = useWindowDimensions();
  const isMobile = useMemo(() => dimensions.width && dimensions.width <= MAX_SCREEN_SIZES.MOBILE, [dimensions.width]);

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Header with description */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-2 flex-1">
          <h2 className={`${isMobile ? 'text-base' : 'text-lg'} font-normal`}>
            Liquidity Providers make low-slippage swaps possible. Deposit and Stake liquidity to earn TEOS.
          </h2>
          <p className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-500`}>
            There are currently{' '}
            <span className="text-[#d0de27] font-semibold">{formatNumber(totalPools)} Unique Pairs</span>
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-wrap gap-6 md:gap-10 items-center">
          <div className="flex flex-col gap-2">
            <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>TVL</span>
            <span className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`}>
              ~{formatNumber(tvl, undefined, undefined, true)}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>Fees</span>
            <span className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`}>
              ~{formatNumber(fees, undefined, undefined, true)}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>Volume</span>
            <span className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`}>
              ~{formatNumber(volume, undefined, undefined, true)}
            </span>
          </div>
        </div>
        <Button
          variant="primary"
          className={`${isMobile ? 'text-sm px-4 py-2 w-full' : 'px-6 py-3'} flex items-center gap-2`}
          onClick={onDepositClick}
        >
          Deposit Liquidity
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="inline-block"
          >
            <path
              d="M4 12L12 4M12 4H6M12 4V10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
};

export default LiquidityHero;
