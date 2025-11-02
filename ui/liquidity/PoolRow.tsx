'use client';

import Image from 'next/image';
import { Button } from '@/components';
import { Themes, MAX_SCREEN_SIZES } from '@/constants';
import { themeAtom } from '@/store';
import { PoolData } from '@/typings';
import { useAtom } from 'jotai';
import { useMemo } from 'react';
import { useWindowDimensions } from '@/hooks/utils';

interface PoolRowProps {
  pool: PoolData;
  onDeposit?: (poolId: string) => void;
}

const PoolRow: React.FC<PoolRowProps> = ({ pool, onDeposit }) => {
  const [theme] = useAtom(themeAtom);
  const isDarkMode = useMemo(() => theme === Themes.DARK, [theme]);
  const dimensions = useWindowDimensions();
  const isMobile = useMemo(() => dimensions.width && dimensions.width <= MAX_SCREEN_SIZES.MOBILE, [dimensions.width]);

  // Pool type colors
  const getPoolTypeColor = (type: string) => {
    switch (type) {
      case 'stable':
        return 'text-teal-600 dark:text-teal-500'; // Navy green
      case 'volatile':
        return 'text-yellow-500'; // Yellow
      case 'concentrated':
        return 'text-blue-700 dark:text-blue-600'; // Dark blue
      default:
        return 'text-gray-500';
    }
  };

  if (isMobile) {
    // Mobile card layout
    return (
      <div
        className={`flex flex-col gap-4 p-4 rounded-lg border ${
          isDarkMode ? 'bg-[#211b1b] border-[#333333]' : 'bg-white border-[#d9d9d9]'
        }`}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="flex items-center -space-x-2">
              <Image
                src={pool.token0.logoURI}
                alt={pool.token0.symbol}
                className={`w-6 h-6 rounded-full border-2 ${isDarkMode ? 'border-[#211b1b]' : 'border-white'}`}
                width={24}
                height={24}
              />
              <Image
                src={pool.token1.logoURI}
                alt={pool.token1.symbol}
                className={`w-6 h-6 rounded-full border-2 ${isDarkMode ? 'border-[#211b1b]' : 'border-white'}`}
                width={24}
                height={24}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-sm">
                {pool.token0.symbol}/{pool.token1.symbol}
              </span>
              <div className="flex gap-2 flex-wrap items-center">
                <span className={`text-xs font-semibold capitalize ${getPoolTypeColor(pool.type)}`}>{pool.type}</span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-500">{pool.feeRate}</span>
              </div>
            </div>
          </div>
        </div>

        {pool.hasPoints && pool.pointsText && (
          <div
            className={`px-3 py-2 rounded-lg border text-xs ${
              isDarkMode ? 'bg-[#333333] border-[#555555]' : 'bg-[#f5f5f5] border-[#d9d9d9]'
            }`}
          >
            {pool.pointsText}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <span className="text-xs text-gray-500">Volume</span>
            <span className="text-sm font-semibold">{pool.volume}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs text-gray-500">Fees</span>
            <span className="text-sm font-semibold">{pool.fees}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs text-gray-500">TVL</span>
            <span className="text-sm font-semibold">{pool.tvl}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs text-gray-500">APR</span>
            <span className="text-sm font-semibold">{pool.apr}</span>
          </div>
        </div>

        {(pool.reserves?.token0 || pool.reserves?.token1) && (
          <div className="flex flex-wrap gap-2 text-xs">
            {pool.reserves.token0 && (
              <span className="text-gray-500">
                {pool.reserves.token0} {pool.token0.symbol}
              </span>
            )}
            {pool.reserves.token1 && (
              <span className="text-gray-500">
                {pool.reserves.token1} {pool.token1.symbol}
              </span>
            )}
          </div>
        )}

        <Button variant="primary" className="w-full text-sm py-2" onClick={() => onDeposit?.(pool.id)}>
          New Deposit
        </Button>
      </div>
    );
  }

  // Desktop table row layout
  return (
    <div
      className={`grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 items-start p-4 rounded-lg border transition-all hover:shadow-lg ${
        isDarkMode
          ? 'bg-[#211b1b] border-[#333333] hover:border-[#555555]'
          : 'bg-white border-[#d9d9d9] hover:border-[#999999]'
      }`}
    >
      {/* Pool Info */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-start gap-3">
          <div className="flex items-center -space-x-2">
            <Image
              src={pool.token0.logoURI}
              alt={pool.token0.symbol}
              className={`w-8 h-8 rounded-full border-2 ${isDarkMode ? 'border-[#211b1b]' : 'border-white'}`}
              width={32}
              height={32}
            />
            <Image
              src={pool.token1.logoURI}
              alt={pool.token1.symbol}
              className={`w-8 h-8 rounded-full border-2 ${isDarkMode ? 'border-[#211b1b]' : 'border-white'}`}
              width={32}
              height={32}
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-base">
              {pool.token0.symbol}/{pool.token1.symbol}
            </span>
            <div className="flex gap-2 flex-wrap items-center">
              <span className={`text-sm font-semibold capitalize ${getPoolTypeColor(pool.type)}`}>{pool.type}</span>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">{pool.feeRate}</span>
            </div>
          </div>
        </div>
        {pool.hasPoints && pool.pointsText && (
          <div
            className={`px-3 py-1.5 rounded-lg border text-xs w-fit ${
              isDarkMode ? 'bg-[#333333] border-[#555555]' : 'bg-[#f5f5f5] border-[#d9d9d9]'
            }`}
          >
            {pool.pointsText}
          </div>
        )}
      </div>

      {/* Volume */}
      <div className="flex justify-start">
        <div className="flex flex-col gap-1 items-end">
          <span className="font-semibold text-end">{pool.volume}</span>
          {(pool.token0.amount || pool.token1.amount) && (
            <div className="flex flex-col gap-1 mt-6 items-end">
              {pool.token0.amount && (
                <span className="text-xs text-gray-500">
                  {pool.token0.amount} {pool.token0.symbol}
                </span>
              )}
              {pool.token1.amount && (
                <span className="text-xs text-gray-500">
                  {pool.token1.amount} {pool.token1.symbol}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Fees */}
      <div className="flex justify-start">
        <div className="flex flex-col gap-1 items-end">
          <span className="font-semibold text-end">{pool.fees}</span>
          {pool.feeAmounts && (
            <div className="flex flex-col gap-1 mt-6 items-end">
              <span className="text-xs text-gray-500">
                {pool.feeAmounts.token0} {pool.token0.symbol}
              </span>
              <span className="text-xs text-gray-500">
                {pool.feeAmounts.token1} {pool.token1.symbol}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* TVL */}
      <div className="flex justify-start">
        <div className="flex flex-col gap-1 items-end">
          <span className="font-semibold text-end">{pool.tvl}</span>
          {pool.reserves && (
            <div className="flex flex-col gap-1 mt-6 items-end">
              <span className="text-xs text-gray-500">
                {pool.reserves.token0} {pool.token0.symbol}
              </span>
              <span className="text-xs text-gray-500">
                {pool.reserves.token1} {pool.token1.symbol}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* APR */}
      <div className="flex justify-start">
        <div className="flex flex-col gap-1 items-end">
          <span className="font-semibold">{pool.apr}</span>
          <div className="mt-6">
            <Button
              variant="primary"
              className="px-4 py-2 text-sm whitespace-nowrap"
              onClick={() => onDeposit?.(pool.id)}
            >
              New Deposit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoolRow;
