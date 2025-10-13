'use client';

import { Card } from '@/components';
import { MAX_SCREEN_SIZES, Themes } from '@/constants';
import { themeAtom } from '@/store';
import { useAtom } from 'jotai';
import { useMemo } from 'react';
import { PositionData } from '@/typings';
import PositionRow from './PositionRow';
import { useWindowDimensions } from '@/hooks/utils';

interface PositionTableProps {
  positions: PositionData[];
  onWithdraw?: (positionId: string) => void;
  onStake?: (positionId: string) => void;
  onUnstake?: (positionId: string) => void;
}

const PositionTable: React.FC<PositionTableProps> = ({ positions, onWithdraw, onStake, onUnstake }) => {
  const [theme] = useAtom(themeAtom);
  const isDarkMode = useMemo(() => theme === Themes.DARK, [theme]);
  const dimensions = useWindowDimensions();
  const isMobile = useMemo(() => dimensions.width && dimensions.width <= MAX_SCREEN_SIZES.MOBILE, [dimensions.width]);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Table Header Card (Desktop only) */}
      {!isMobile && (
        <Card
          variant={isDarkMode ? 'neutral' : 'primary'}
          className={`w-full px-4 py-3 ${!isDarkMode && 'border border-[#d9d9d9]'}`}
        >
          <div className="grid grid-cols-[2fr_1fr_0.8fr_1fr_1fr] gap-4">
            <span className="text-sm font-semibold text-gray-500 uppercase">Liquidity Pool</span>
            <span className="text-sm font-semibold text-gray-500 uppercase text-right">TVL</span>
            <span className="text-sm font-semibold text-gray-500 uppercase text-center">APR</span>
            <span className="text-sm font-semibold text-gray-500 uppercase text-right">Your Deposit</span>
            <span className="text-sm font-semibold text-gray-500 uppercase text-right">Staked</span>
          </div>
        </Card>
      )}

      {/* Position Rows Body Card */}
      <Card
        variant={isDarkMode ? 'neutral' : 'primary'}
        className={`w-full px-4 py-4 ${!isDarkMode && 'border border-[#d9d9d9]'}`}
      >
        <div className="flex flex-col gap-3">
          {positions.length > 0 ? (
            positions.map(position => (
              <PositionRow
                key={position.id}
                position={position}
                onWithdraw={onWithdraw}
                onStake={onStake}
                onUnstake={onUnstake}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <span className="text-gray-500 text-lg">No positions found</span>
              <span className="text-gray-400 text-sm">Try adjusting your search or filter</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PositionTable;
