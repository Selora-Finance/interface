'use client';

import { Card } from '@/components';
import { Themes, MAX_SCREEN_SIZES } from '@/constants';
import { themeAtom } from '@/store';
import { PoolData } from '@/typings';
import { useAtom } from 'jotai';
import { useMemo } from 'react';
import { useWindowDimensions } from '@/hooks/utils';
import PoolRow from './PoolRow';

interface PoolTableProps {
  pools: PoolData[];
  onDeposit?: (poolId: string) => void;
}

const PoolTable: React.FC<PoolTableProps> = ({ pools, onDeposit }) => {
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
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4">
            <span className="text-sm font-semibold text-gray-500 uppercase">Pools</span>
            <span className="text-sm font-semibold text-gray-500 uppercase">Volume</span>
            <span className="text-sm font-semibold text-gray-500 uppercase">Fees</span>
            <span className="text-sm font-semibold text-gray-500 uppercase">TVL</span>
            <span className="text-sm font-semibold text-gray-500 uppercase">APR</span>
          </div>
        </Card>
      )}

      {/* Pool Rows Body Card */}
      <Card
        variant={isDarkMode ? 'neutral' : 'primary'}
        className={`w-full px-4 py-4 ${!isDarkMode && 'border border-[#d9d9d9]'}`}
      >
        <div className="flex flex-col gap-3">
          {pools.length > 0 ? (
            pools.map(pool => <PoolRow key={pool.id} pool={pool} onDeposit={onDeposit} />)
          ) : (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <span className="text-gray-500 text-lg">No pools found</span>
              <span className="text-gray-400 text-sm">Try adjusting your search or filter</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PoolTable;
