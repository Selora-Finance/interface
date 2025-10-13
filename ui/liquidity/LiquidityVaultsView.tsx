'use client';

import { useState } from 'react';
import { Button, Slider } from '@/components';
import { PoolSelector } from './PoolSelector';

interface LiquidityVaultsViewProps {
  activeTab: 'stake' | 'unstake';
  onTabChange: (tab: 'stake' | 'unstake') => void;
}

export function LiquidityVaultsView({ activeTab, onTabChange }: LiquidityVaultsViewProps) {
  const [selectedPool, setSelectedPool] = useState<string | null>(null);
  const [stakeAmount, setStakeAmount] = useState<number>(75);

  const handleStake = () => {
    console.log('Stake LP:', { pool: selectedPool, amount: stakeAmount });
    // TODO: Implement stake logic
  };

  const handleUnstake = () => {
    console.log('Unstake LP:', { pool: selectedPool, amount: stakeAmount });
    // TODO: Implement unstake logic
  };

  return (
    <div className="w-full flex flex-col gap-8 justify-start items-center">
      {/* Tabs */}
      <div className="flex border-b border-gray-600 w-full">
        <button
          onClick={() => onTabChange('stake')}
          className={`px-8 py-4 font-medium transition-colors ${
            activeTab === 'stake'
              ? 'text-white border-b-2 border-[#d0de27] bg-gray-700'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Stake
        </button>
        <button
          onClick={() => onTabChange('unstake')}
          className={`px-8 py-4 font-medium transition-colors ${
            activeTab === 'unstake'
              ? 'text-white border-b-2 border-[#d0de27] bg-gray-700'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Unstake
        </button>
      </div>

      {/* Pool Selection */}
      <div className="space-y-3 w-full">
        <label className="text-sm font-medium text-gray-300">Select Pool</label>
        <PoolSelector selectedPool={selectedPool} onPoolSelect={setSelectedPool} />
      </div>

      {/* Amount to Stake */}
      <div className="space-y-5 w-full">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-gray-300">Amount to Stake:</label>
          <span className="text-sm text-gray-400">Balance: 0.00</span>
        </div>

        <Slider value={stakeAmount} onChange={setStakeAmount} min={0} max={100} step={25} variant="primary" />
      </div>

      {/* Action Button */}
      <Button
        variant="primary"
        className="w-full py-6 text-lg font-semibold"
        onClick={activeTab === 'stake' ? handleStake : handleUnstake}
        disabled={!selectedPool}
      >
        {activeTab === 'stake' ? 'Stake LP' : 'Unstake LP'}
      </Button>
    </div>
  );
}
