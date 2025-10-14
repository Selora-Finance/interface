'use client';

import { useState, useMemo } from 'react';
import { RewardsTable } from '@/ui/liquidity/RewardsTable';
import { useAtom } from 'jotai';
import { themeAtom } from '@/store';
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

const mockRewardsData: RewardData[] = [
  {
    id: '1',
    pair: {
      token0: 'ETH',
      token1: 'CEDA',
      poolType: 'Basic Volatile',
      feeTier: '0.3%',
    },
    emissionRate: '38.06%',
    bonusMultiplier: '+10x Points',
    rewardEarned: {
      totalValue: '~$9.14K',
      token0Amount: '34,783.52 CEDA',
      token1Amount: '19,366.48 veCEDA',
    },
    claimableFees: {
      totalValue: '~$9.14K',
      token0Amount: '3.52 WETH',
      token1Amount: '19,366.48 CEDA',
    },
  },
  {
    id: '2',
    pair: {
      token0: 'ETH',
      token1: 'CEDA',
      poolType: 'Basic Volatile',
      feeTier: '0.3%',
    },
    emissionRate: '38.06%',
    bonusMultiplier: '+10x Points',
    rewardEarned: {
      totalValue: '~$9.14K',
      token0Amount: '34,783.52 CEDA',
      token1Amount: '19,366.48 veCEDA',
    },
    claimableFees: {
      totalValue: '~$9.14K',
      token0Amount: '3.52 WETH',
      token1Amount: '19,366.48 CEDA',
    },
  },
];

export default function LiquidityRewardsPage() {
  const [theme] = useAtom(themeAtom);
  const isDarkMode = useMemo(() => theme === Themes.DARK, [theme]);
  const [rewards] = useState<RewardData[]>(mockRewardsData);

  const handleClaimReward = (rewardId: string) => {
    console.log('Claim reward:', rewardId);
    // TODO: Implement claim reward logic
  };

  const handleClaimFees = (rewardId: string) => {
    console.log('Claim fees:', rewardId);
    // TODO: Implement claim fees logic
  };

  return (
    <div className="flex w-full flex-1 justify-center items-start flex-col gap-8 py-6 md:py-12 my-24 md:my-36 mx-auto relative px-3 md:px-6 max-w-[90rem]">
      {/* Title */}
      <h2 className={`text-2xl md:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
        Your Liquidity Rewards
      </h2>

      {/* Table Section */}
      <div className="w-full flex flex-col gap-6">
        <RewardsTable rewards={rewards} onClaimReward={handleClaimReward} onClaimFees={handleClaimFees} />
      </div>
    </div>
  );
}
