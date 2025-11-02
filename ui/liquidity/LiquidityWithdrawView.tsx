'use client';

import { useState } from 'react';
import { Button, Slider } from '@/components';
import { PoolSelector } from './PoolSelector';

interface LiquidityWithdrawViewProps {
  withdraw?: boolean;
}

export function LiquidityWithdrawView({}: LiquidityWithdrawViewProps) {
  const [selectedPool, setSelectedPool] = useState<string | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(75);

  const handleApprove = () => {
    // TODO: Implement approve/remove flow
    console.log('Approve LP for removal:', { pool: selectedPool, amount: withdrawAmount });
  };

  return (
    <div className="w-full flex flex-col gap-8 justify-start items-center">
      {/* Pool Selection */}
      <div className="space-y-3 w-full">
        <label className="text-sm font-medium text-gray-300">Select Pool</label>
        <PoolSelector selectedPool={selectedPool} onPoolSelect={setSelectedPool} />
      </div>

      {/* Amount to Remove */}
      <div className="space-y-5 w-full">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-gray-300">Amount to Remove:</label>
          <span className="text-sm text-gray-400">Balance: 0.00</span>
        </div>

        <Slider value={withdrawAmount} onChange={setWithdrawAmount} min={0} max={100} step={25} variant="primary" />
      </div>

      {/* Action Button */}
      <Button
        variant="primary"
        className="w-full py-6 text-lg font-semibold"
        onClick={handleApprove}
        disabled={!selectedPool}
      >
        Approve LP
      </Button>
    </div>
  );
}
