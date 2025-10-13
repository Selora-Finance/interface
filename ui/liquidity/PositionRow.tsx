'use client';

import Image from 'next/image';
import { Button } from '@/components';
import { MAX_SCREEN_SIZES, Themes } from '@/constants';
import { themeAtom } from '@/store';
import { useAtom } from 'jotai';
import { useMemo } from 'react';
import { PositionData } from '@/typings';
import { useWindowDimensions } from '@/hooks/utils';

interface PositionRowProps {
  position: PositionData;
  onWithdraw?: (positionId: string) => void;
  onStake?: (positionId: string) => void;
  onUnstake?: (positionId: string) => void;
}

const PositionRow: React.FC<PositionRowProps> = ({ position, onWithdraw, onStake, onUnstake }) => {
  const [theme] = useAtom(themeAtom);
  const isDarkMode = useMemo(() => theme === Themes.DARK, [theme]);
  const dimensions = useWindowDimensions();
  const isMobile = useMemo(() => dimensions.width && dimensions.width <= MAX_SCREEN_SIZES.MOBILE, [dimensions.width]);

  const getPoolTypeColor = (type: string) => {
    switch (type) {
      case 'stable':
        return 'text-teal-600 dark:text-teal-500';
      case 'volatile':
        return 'text-yellow-500';
      case 'concentrated':
        return 'text-blue-700 dark:text-blue-600';
      default:
        return 'text-gray-500';
    }
  };

  if (isMobile) {
    return (
      <div
        className={`flex flex-col gap-4 p-4 rounded-lg border ${
          isDarkMode ? 'bg-[#1a1515] border-[#333333]' : 'bg-white border-[#d9d9d9]'
        }`}
      >
        {/* Token Pair */}
        <div className="flex items-center gap-3">
          <div className="flex items-center -space-x-2">
            <Image
              src={position.token0.logoURI}
              alt={position.token0.symbol}
              className={`w-8 h-8 rounded-full border-2 ${isDarkMode ? 'border-[#1a1515]' : 'border-white'}`}
              width={32}
              height={32}
            />
            <Image
              src={position.token1.logoURI}
              alt={position.token1.symbol}
              className={`w-8 h-8 rounded-full border-2 ${isDarkMode ? 'border-[#1a1515]' : 'border-white'}`}
              width={32}
              height={32}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-lg">
              {position.token0.symbol}/{position.token1.symbol}
            </span>
            <div className="flex gap-2 flex-wrap items-center">
              <span className={`text-xs font-semibold capitalize ${getPoolTypeColor(position.type)}`}>
                {position.type}
              </span>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-gray-500">{position.feeRate}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">TVL</span>
            <span className="font-semibold">{position.tvl}</span>
            {position.poolTvl && (
              <div className="flex flex-col gap-1 mt-2">
                <span className="text-xs text-gray-500">
                  {position.poolTvl.token0} {position.token0.symbol}
                </span>
                <span className="text-xs text-gray-500">
                  {position.poolTvl.token1} {position.token1.symbol}
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">APR</span>
            <span className="font-semibold">{position.apr}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">Your Deposit</span>
            <span className="font-semibold">{position.yourDeposit}</span>
            {position.token0.amount && position.token1.amount && (
              <div className="flex flex-col gap-1 mt-2">
                <span className="text-xs text-gray-500">
                  {position.token0.amount} {position.token0.symbol}
                </span>
                <span className="text-xs text-gray-500">
                  {position.token1.amount} {position.token1.symbol}
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">Staked</span>
            <span className="font-semibold">{position.staked}</span>
            {position.token0.amount && position.token1.amount && (
              <div className="flex flex-col gap-1 mt-2">
                <span className="text-xs text-gray-500">
                  {position.token0.amount} {position.token0.symbol}
                </span>
                <span className="text-xs text-gray-500">
                  {position.token1.amount} {position.token1.symbol}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Points Badge */}
        {position.hasPoints && (
          <div className="flex justify-start">
            <span className="px-3 py-1 bg-[#d0de27] text-black text-xs font-semibold rounded-full">
              {position.pointsText}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap">
          <Button variant="primary" className="px-4 py-2 text-sm flex-1" onClick={() => onWithdraw?.(position.id)}>
            Withdraw
          </Button>
          <Button variant="primary" className="px-4 py-2 text-sm flex-1" onClick={() => onStake?.(position.id)}>
            Stake
          </Button>
          <Button variant="primary" className="px-4 py-2 text-sm flex-1" onClick={() => onUnstake?.(position.id)}>
            UnStake
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-[2fr_1fr_0.8fr_1fr_1fr] gap-4 items-start p-4 rounded-lg border ${
        isDarkMode ? 'bg-[#1a1515] border-[#333333]' : 'bg-white border-[#d9d9d9]'
      }`}
    >
      {/* Token Pair */}
      <div className="flex items-center gap-3">
        <div className="flex items-center -space-x-2">
          <Image
            src={position.token0.logoURI}
            alt={position.token0.symbol}
            className={`w-8 h-8 rounded-full border-2 ${isDarkMode ? 'border-[#1a1515]' : 'border-white'}`}
            width={32}
            height={32}
          />
          <Image
            src={position.token1.logoURI}
            alt={position.token1.symbol}
            className={`w-8 h-8 rounded-full border-2 ${isDarkMode ? 'border-[#1a1515]' : 'border-white'}`}
            width={32}
            height={32}
          />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-lg">
            {position.token0.symbol}/{position.token1.symbol}
          </span>
          <div className="flex gap-2 flex-wrap items-center">
            <span className={`text-xs font-semibold capitalize ${getPoolTypeColor(position.type)}`}>
              {position.type}
            </span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-500">{position.feeRate}</span>
          </div>
          {position.hasPoints && (
            <div className="mt-2">
              <span className="px-3 py-1 bg-[#d0de27] text-black text-xs font-semibold rounded-full">
                {position.pointsText}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* TVL */}
      <div className="text-right">
        <div className="font-semibold">{position.tvl}</div>
        {position.poolTvl && (
          <div className="mt-2 space-y-1">
            <div className="text-xs text-gray-500">
              {position.poolTvl.token0} {position.token0.symbol}
            </div>
            <div className="text-xs text-gray-500">
              {position.poolTvl.token1} {position.token1.symbol}
            </div>
          </div>
        )}
      </div>

      {/* APR */}
      <div className="text-center">
        <div className="font-semibold">{position.apr}</div>
      </div>

      {/* Your Deposit */}
      <div className="text-right">
        <div className="font-semibold">{position.yourDeposit}</div>
        {position.token0.amount && position.token1.amount && (
          <div className="mt-2 space-y-1">
            <div className="text-xs text-gray-500">
              {position.token0.amount} {position.token0.symbol}
            </div>
            <div className="text-xs text-gray-500">
              {position.token1.amount} {position.token1.symbol}
            </div>
          </div>
        )}
        <div className="mt-4">
          <Button
            variant="primary"
            className="px-3 py-2 text-sm whitespace-nowrap"
            onClick={() => onWithdraw?.(position.id)}
          >
            Withdraw
          </Button>
        </div>
      </div>

      {/* Staked */}
      <div className="text-right">
        <div className="font-semibold">{position.staked}</div>
        {position.token0.amount && position.token1.amount && (
          <div className="mt-2 space-y-1">
            <div className="text-xs text-gray-500">
              {position.token0.amount} {position.token0.symbol}
            </div>
            <div className="text-xs text-gray-500">
              {position.token1.amount} {position.token1.symbol}
            </div>
          </div>
        )}
        <div className="mt-4 flex gap-2 justify-end">
          <Button
            variant="primary"
            className="px-3 py-2 text-sm whitespace-nowrap"
            onClick={() => onStake?.(position.id)}
          >
            Stake
          </Button>
          <Button
            variant="primary"
            className="px-3 py-2 text-sm whitespace-nowrap"
            onClick={() => onUnstake?.(position.id)}
          >
            UnStake
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PositionRow;
