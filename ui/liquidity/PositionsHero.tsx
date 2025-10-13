'use client';

import { Button } from '@/components';
import { MAX_SCREEN_SIZES, Themes } from '@/constants';
import { themeAtom } from '@/store';
import { useAtom } from 'jotai';
import { useMemo } from 'react';
import { ExternalLink } from 'lucide-react';
import { useWindowDimensions } from '@/hooks/utils';

interface PositionsHeroProps {
  totalPositions: number;
  onNewDepositClick?: () => void;
}

const PositionsHero: React.FC<PositionsHeroProps> = ({ totalPositions, onNewDepositClick }) => {
  const [theme] = useAtom(themeAtom);
  const isDarkMode = useMemo(() => theme === Themes.DARK, [theme]);
  const dimensions = useWindowDimensions();
  const isMobile = useMemo(() => dimensions.width && dimensions.width <= MAX_SCREEN_SIZES.MOBILE, [dimensions.width]);

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Header with description */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-2 flex-1">
          <h2 className={`${isMobile ? 'text-base' : 'text-lg'} font-normal`}>
            Liquidity Providers make low-slippage swaps possible. Deposit and Stake liquidity to earn CEDA.
          </h2>
          <p className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-500`}>
            You currently have <span className="text-[#d0de27] font-semibold">{totalPositions} Liquidity</span>
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-wrap gap-6 md:gap-10 items-center">
          <div className="flex flex-col gap-2">
            <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>Your TVL Deposited</span>
            <span className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`}>~$680.52</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>Your Fees Earned</span>
            <span className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`}>~$401.32</span>
          </div>
        </div>

        {/* New Deposit Button */}
        <Button
          variant="primary"
          className="px-6 py-3 text-sm md:text-base whitespace-nowrap flex items-center gap-2"
          onClick={onNewDepositClick}
        >
          New Deposit
          <ExternalLink size={isMobile ? 14 : 16} />
        </Button>
      </div>
    </div>
  );
};

export default PositionsHero;
