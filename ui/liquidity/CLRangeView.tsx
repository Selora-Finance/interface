'use client';

import { Card, LineChart } from '@/components';
import { BASE_POINT, MAX_SCREEN_SIZES, REFETCH_INTERVALS, Themes } from '@/constants';
import { themeAtom } from '@/store';
import { AssetType } from '@/typings';
import { useAtom } from 'jotai';
import { useId, useMemo } from 'react';
import { useWindowDimensions } from '@/hooks/utils';
import Image from 'next/image';
import useQLTokenInfo from '@/hooks/useQLTokenInfo';
import useQLTokenDayChartMovement from '@/hooks/useQLTokenDayChartMovement';
import { formatNumber, isValidNonZeroNumberString } from '@/lib/client/utils';

interface CLRangeViewProps {
  asset0?: AssetType | null;
  asset1?: AssetType | null;
  minPrice?: number;
  maxPrice?: number;
  currentPrice?: number;
  amount0?: string;
  amount1?: string;
  feeTier?: string;
  tvl?: number | string;
  earnings?: number | string;
  onRangeChange?: (min: number, max: number) => void;
}

const CLRangeView: React.FC<CLRangeViewProps> = ({
  asset0,
  asset1,
  minPrice = 0.0,
  maxPrice = 0.0,
  currentPrice = 0.00002454738,
  amount0 = '0',
  amount1 = '0',
  feeTier = '0.01',
  tvl = 0,
  earnings = 0,
  onRangeChange,
}) => {
  const [theme] = useAtom(themeAtom);
  const isDarkMode = useMemo(() => theme === Themes.DARK, [theme]);
  const dimensions = useWindowDimensions();
  const isMobile = useMemo(() => dimensions.width && dimensions.width <= MAX_SCREEN_SIZES.MOBILE, [dimensions.width]);
  const placeHolderId = useId();

  const token0Info = useQLTokenInfo(asset0?.address.toLowerCase() ?? placeHolderId, REFETCH_INTERVALS);
  const token1DayData = useQLTokenDayChartMovement(asset1?.address.toLowerCase() ?? placeHolderId, REFETCH_INTERVALS);

  // Generate chart data with realistic price movement using Geometric Brownian Motion
  const chartData = useMemo(() => {
    const data = token1DayData.map(dayData => {
      const x = dayData.date * BASE_POINT;
      const y =
        isValidNonZeroNumberString(dayData.priceUSD) && token0Info && isValidNonZeroNumberString(token0Info.derivedUSD)
          ? parseFloat(dayData.priceUSD) / parseFloat(token0Info.derivedUSD)
          : 0;
      const date = new Date(x);
      return { x, y, date };
    });
    const totalPoints = 200;
    // Ensure the last few points converge to current price for realism
    const convergencePoints = 10;
    for (let i = totalPoints - convergencePoints; i < totalPoints; i++) {
      const idx = data.length - (totalPoints - i);
      const convergenceFactor = (i - (totalPoints - convergencePoints)) / convergencePoints;
      if (data[idx]) {
        data[idx].y = data[idx].y * (1 - convergenceFactor) + currentPrice * convergenceFactor;
      }
    }
    return data;
  }, [currentPrice, token0Info, token1DayData]);

  return (
    <div className="flex justify-center items-start w-full md:w-[48%]">
      <Card
        variant={isDarkMode ? 'neutral' : 'primary'}
        className={`flex justify-center items-start w-full px-4 md:px-6 py-6 md:py-8 ${
          !isDarkMode && 'border border-[#d9d9d9]'
        } ${isMobile ? 'text-base' : 'text-lg'}`}
      >
        <div className="flex flex-col justify-start w-full items-center gap-6">
          {/* Header Section */}
          <div className="w-full flex flex-col gap-4">
            <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold`}>Visualize range</h3>
            <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>
              View your range against the price and liquidity distribution.
            </p>
            <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div className="flex items-center gap-2">
                <span className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-500`}>
                  {asset0?.symbol || 'Token0'} price in {asset1?.symbol || 'Token1'}
                </span>
                {/* <button className="p-1 rounded hover:bg-gray-700 transition-colors">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className={isDarkMode ? 'text-white' : 'text-black'}
                  >
                    <path
                      d="M2 5L5 2M5 2L8 5M5 2V10M14 11L11 14M11 14L8 11M11 14V6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button> */}
              </div>
              <span className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold`}>
                Current: {formatNumber(currentPrice.toFixed(5))} {asset1?.symbol || 'Token1'}/
                {asset0?.symbol || 'Token0'}
              </span>
            </div>
          </div>

          {/* Chart */}
          <div className="w-full" style={{ position: 'relative' }}>
            <LineChart
              data={chartData}
              rangeStart={minPrice}
              rangeEnd={maxPrice}
              currentValue={currentPrice}
              lineColor={isDarkMode ? '#ffffff' : '#000000'}
              rangeColor="#d0de27"
              currentValueColor="#d0de27"
              showRange={true}
              rangeOrientation="horizontal"
              showCurrentLabel={true}
              currentPrice={currentPrice}
              variant={isDarkMode ? 'neutral' : 'primary'}
              onRangeChange={(min, max) => {
                onRangeChange?.(min, max);
              }}
            />
          </div>

          {/* Chart Legend - Vertical in Dark Box */}
          <div className={`w-full flex flex-col gap-3 p-4 rounded-lg ${isDarkMode ? 'bg-[#1a1515]' : 'bg-[#f5f5f5]'}`}>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isDarkMode ? 'bg-white' : 'bg-gray-700'}`}></div>
              <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>Historical Price</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#d0de27]"></div>
              <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>Current Price</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#d0de27] opacity-50"></div>
              <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>Range</span>
            </div>
          </div>

          {/* Container with Fee Tier, Prices, and Amounts */}
          <div className={`w-full flex flex-col gap-4 p-4 rounded-lg ${isDarkMode ? 'bg-[#1a1515]' : 'bg-[#f5f5f5]'}`}>
            {/* Fee Tier Info */}
            <div className="w-full flex justify-between items-center">
              <div className="flex items-center gap-3">
                {asset0 && asset1 && (
                  <div className="flex items-center -space-x-2">
                    <Image
                      src={asset0.logoURI}
                      alt={asset0.symbol}
                      className={`w-5 h-5 rounded-full border-2 ${
                        isDarkMode ? 'border-[#1a1515]' : 'border-[#f5f5f5]'
                      }`}
                      width={20}
                      height={20}
                    />
                    <Image
                      src={asset1.logoURI}
                      alt={asset1.symbol}
                      className={`w-5 h-5 rounded-full border-2 ${
                        isDarkMode ? 'border-[#1a1515]' : 'border-[#f5f5f5]'
                      }`}
                      width={20}
                      height={20}
                    />
                  </div>
                )}
                <span className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold`}>
                  {asset0?.symbol || 'Token0'}/{asset1?.symbol || 'Token1'}
                </span>
              </div>
              <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>{feeTier}</span>
            </div>

            {/* Min Price and Max Price Cards */}
            <div className="w-full grid grid-cols-2 gap-3">
              <div className={`flex flex-col gap-2 p-3 rounded-lg ${isDarkMode ? 'bg-[#0d0a0a]' : 'bg-[#e8e8e8]'}`}>
                <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>Min Price</span>
                <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-normal`}>
                  {minPrice.toFixed(4)} {asset0?.symbol || 'Token0'}/{asset1?.symbol || 'Token1'}
                </span>
              </div>
              <div className={`flex flex-col gap-2 p-3 rounded-lg ${isDarkMode ? 'bg-[#0d0a0a]' : 'bg-[#e8e8e8]'}`}>
                <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>Max Price</span>
                <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-normal`}>
                  {maxPrice.toFixed(4)} {asset0?.symbol || 'Token0'}/{asset1?.symbol || 'Token1'}
                </span>
              </div>
            </div>

            {/* Token Amount Cards */}
            <div className="w-full grid grid-cols-2 gap-3">
              <div className={`flex flex-col gap-2 p-3 rounded-lg ${isDarkMode ? 'bg-[#0d0a0a]' : 'bg-[#e8e8e8]'}`}>
                <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>
                  {asset0?.symbol || 'Token0'} Amount
                </span>
                <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-normal`}>{amount0 || '0'}</span>
              </div>
              <div className={`flex flex-col gap-2 p-3 rounded-lg ${isDarkMode ? 'bg-[#0d0a0a]' : 'bg-[#e8e8e8]'}`}>
                <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>
                  {asset1?.symbol || 'Token1'} Amount
                </span>
                <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-normal`}>{amount1 || '0'}</span>
              </div>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="w-full flex flex-col gap-3 pt-4">
            <div className="w-full justify-between items-center flex gap-3">
              <span className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-500`}>TVL</span>
              <span className={`${isMobile ? 'text-sm' : 'text-base'} font-normal`}>
                {formatNumber(tvl, undefined, 4, true)}
              </span>
            </div>
            <div className="w-full justify-between items-center flex gap-3">
              <span className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-500`}>Est. earnings</span>
              <span className={`${isMobile ? 'text-sm' : 'text-base'} font-normal`}>
                {formatNumber(earnings, undefined, 4, true)}
              </span>
            </div>
            <div className="w-full justify-between items-center flex gap-3">
              <span className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-500`}>Current Fee Tier</span>
              <span className={`${isMobile ? 'text-sm' : 'text-base'} font-normal`}>{feeTier}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CLRangeView;
