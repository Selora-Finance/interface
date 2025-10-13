'use client';

import { Card } from '@/components';
import { MAX_SCREEN_SIZES, Themes } from '@/constants';
import { themeAtom } from '@/store';
import { useAtom } from 'jotai';
import { useMemo } from 'react';
import { useWindowDimensions } from '@/hooks/utils';
import { RewardRow } from './RewardRow';

interface RewardData {
  id: string;
  pair: {
    token0: string;
    token1: string;
    poolType: string;
    feeTier: string;
  };
  emissionRate: string;
  bonusMultiplier?: string;
  rewardEarned: {
    totalValue: string;
    token0Amount: string;
    token1Amount: string;
  };
  claimableFees: {
    totalValue: string;
    token0Amount: string;
    token1Amount: string;
  };
}

interface RewardsTableProps {
  rewards: RewardData[];
  onClaimReward: (rewardId: string) => void;
  onClaimFees: (rewardId: string) => void;
}

export function RewardsTable({ rewards, onClaimReward, onClaimFees }: RewardsTableProps) {
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
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4">
            <span className="text-sm font-semibold text-gray-500 uppercase">PAIR</span>
            <span className="text-sm font-semibold text-gray-500 uppercase">EMISSION RATE</span>
            <span className="text-sm font-semibold text-gray-500 uppercase">REWARD EARNED</span>
            <span className="text-sm font-semibold text-gray-500 uppercase">CLAIMABLE FEES</span>
          </div>
        </Card>
      )}

      {/* Reward Rows Body Card */}
      <Card
        variant={isDarkMode ? 'neutral' : 'primary'}
        className={`w-full px-4 py-4 ${!isDarkMode && 'border border-[#d9d9d9]'}`}
      >
        <div className="flex flex-col gap-3">
          {rewards.length > 0 ? (
            rewards.map(reward => (
              <RewardRow key={reward.id} reward={reward} onClaimReward={onClaimReward} onClaimFees={onClaimFees} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <span className="text-gray-500 text-lg">No rewards found</span>
              <span className="text-gray-400 text-sm">Try adjusting your search or filter</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
