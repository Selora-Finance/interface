'use client';

import { Button } from '@/components/Button';
import { useAtom } from 'jotai';
import { themeAtom } from '@/store';
import { useMemo } from 'react';
import { Themes } from '@/constants';

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

interface RewardRowProps {
  reward: RewardData;
  onClaimReward: (rewardId: string) => void;
  onClaimFees: (rewardId: string) => void;
}

export function RewardRow({ reward, onClaimReward, onClaimFees }: RewardRowProps) {
  const [theme] = useAtom(themeAtom);
  const isDarkMode = useMemo(() => theme === Themes.DARK, [theme]);

  return (
    <div
      className={`grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 items-start p-4 rounded-lg border ${
        isDarkMode ? 'bg-[#1a1515] border-[#333333]' : 'bg-white border-[#d9d9d9]'
      }`}
    >
      {/* PAIR Column */}
      <div className="flex items-center gap-3">
        {/* Token Pair Icon */}
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-green-500 absolute -top-1 -right-1 flex items-center justify-center">
              <span className="text-white text-xs font-bold">U</span>
            </div>
          </div>
        </div>

        <div>
          <div className="font-semibold text-base">
            {reward.pair.token0}/{reward.pair.token1}
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-sm font-semibold capitalize text-yellow-500">{reward.pair.poolType}</span>
            <span className="text-sm text-gray-500">•</span>
            <span className="text-sm text-gray-500">{reward.pair.feeTier}</span>
          </div>
        </div>
      </div>

      {/* Emission Rate Column */}
      <div className="text-left">
        <div className="font-semibold text-base">{reward.emissionRate}</div>
        {reward.bonusMultiplier && <div className="text-sm text-yellow-500 font-medium">{reward.bonusMultiplier}</div>}
      </div>

      {/* Reward Earned Column */}
      <div className="text-left">
        <div className="font-semibold text-base mb-2">{reward.rewardEarned.totalValue}</div>
        <div className="space-y-1 mb-3">
          <div className="text-xs text-gray-500">{reward.rewardEarned.token0Amount}</div>
          <div className="text-xs text-gray-500">{reward.rewardEarned.token1Amount}</div>
        </div>
        <Button
          variant="primary"
          className="px-4 py-2 text-sm whitespace-nowrap"
          onClick={() => onClaimReward(reward.id)}
        >
          Claim
        </Button>
      </div>

      {/* Claimable Fees Column */}
      <div className="text-left">
        <div className="font-semibold text-base mb-2">{reward.claimableFees.totalValue}</div>
        <div className="space-y-1 mb-3">
          <div className="text-xs text-gray-500">{reward.claimableFees.token0Amount}</div>
          <div className="text-xs text-gray-500">{reward.claimableFees.token1Amount}</div>
        </div>
        <Button
          variant="primary"
          className="px-4 py-2 text-sm whitespace-nowrap"
          onClick={() => onClaimFees(reward.id)}
        >
          Claim
        </Button>
      </div>
    </div>
  );
}
