'use client';

import { Card, LineChart } from '@/components';
import { MAX_SCREEN_SIZES, Themes } from '@/constants';
import { themeAtom } from '@/store';
import { AssetType } from '@/typings';
import { useAtom } from 'jotai';
import { useMemo } from 'react';
import { useWindowDimensions } from '@/hooks/utils';
import Image from 'next/image';

interface CLRangeViewProps {
  asset0?: AssetType | null;
  asset1?: AssetType | null;
  minPrice?: number;
  maxPrice?: number;
  currentPrice?: number;
  amount0?: string;
  amount1?: string;
  feeTier?: string;
}

const CLRangeView: React.FC<CLRangeViewProps> = ({
  asset0,
  asset1,
  minPrice = 0.0,
  maxPrice = 0.0,
  currentPrice = 0.00002454738,
  amount0 = '0',
  amount1 = '0',
  feeTier = '0.25%',
}) => {
  const [theme] = useAtom(themeAtom);
  const isDarkMode = useMemo(() => theme === Themes.DARK, [theme]);
  const dimensions = useWindowDimensions();
  const isMobile = useMemo(() => dimensions.width && dimensions.width <= MAX_SCREEN_SIZES.MOBILE, [dimensions.width]);

  // Calculate TVL
  const tvl = useMemo(() => {
    const amt0 = parseFloat(amount0) || 0;
    const amt1 = parseFloat(amount1) || 0;
    // Mock calculation - in real app, this would use actual prices
    return (amt0 * 2000 + amt1 * 0.5).toFixed(2);
  }, [amount0, amount1]);

  // Generate chart data with realistic price movement and dates
  const chartData = useMemo(() => {
    const data = [];
    const totalPoints = 150;
    const historicalPoints = 100;

    // Start date (2 weeks ago)
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 14);

    // Generate historical price data (declining trend)
    let price = currentPrice * 1.5; // Start higher
    for (let i = 0; i < historicalPoints; i++) {
      const t = i / historicalPoints;
      // Create a generally declining trend with volatility
      const trend = currentPrice * 1.5 - currentPrice * 0.5 * t;
      const noise = (Math.random() - 0.5) * currentPrice * 0.05;
      const volatility = Math.sin(i / 5) * currentPrice * 0.02;
      price = trend + noise + volatility;

      // Calculate date for this point
      const pointDate = new Date(startDate);
      pointDate.setHours(startDate.getHours() + i * 3); // 3-hour intervals

      data.push({
        x: pointDate.getTime(),
        y: Math.max(price, currentPrice * 0.5),
        date: pointDate,
      });
    }

    // Add current price point and some future projection
    for (let i = historicalPoints; i < totalPoints; i++) {
      const noise = (Math.random() - 0.5) * currentPrice * 0.01;
      const pointDate = new Date(startDate);
      pointDate.setHours(startDate.getHours() + i * 3);

      data.push({
        x: pointDate.getTime(),
        y: currentPrice + noise,
        date: pointDate,
      });
    }

    return data;
  }, [currentPrice]);

  return (
    <div className="flex justify-center items-start w-full md:w-[48%]">
      <Card
        variant={isDarkMode ? 'neutral' : 'primary'}
        className={`flex justify-center items-start w-full px-4 md:px-6 py-6 md:py-8 ${
          !isDarkMode && 'border border-[#d9d9d9]'
        } ${isMobile ? 'text-base' : 'text-lg'}`}
      >
        <div className="flex flex-col justify-start w-full items-center gap-6">
          {/* Header */}
          <div className="w-full flex justify-between items-center">
            <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold`}>Visualize range</h3>
            <button
              className={`${
                isMobile ? 'text-xs' : 'text-sm'
              } text-gray-500 hover:text-gray-400 transition-colors flex items-center gap-1`}
            >
              View My Positions
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path
                  d="M12 8.66667V12.6667C12 13.0203 11.8595 13.3594 11.6095 13.6095C11.3594 13.8595 11.0203 14 10.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V5.33333C2 4.97971 2.14048 4.64057 2.39052 4.39052C2.64057 4.14048 2.97971 4 3.33333 4H7.33333M10 2H14M14 2V6M14 2L6.66667 9.33333"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500 w-full`}>
            View your range against the price and liquidity distribution
          </p>

          {/* Current Price Display */}
          <div className="w-full flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>
                {asset0 ? (
                  <>
                    <Image
                      src={asset0.logoURI}
                      alt={asset0.symbol}
                      className="inline-block w-4 h-4 rounded-full mr-1"
                      width={16}
                      height={16}
                    />
                    {asset0.symbol}
                  </>
                ) : (
                  'Token 0'
                )}{' '}
                price in{' '}
                {asset1 ? (
                  <>
                    <Image
                      src={asset1.logoURI}
                      alt={asset1.symbol}
                      className="inline-block w-4 h-4 rounded-full mr-1"
                      width={16}
                      height={16}
                    />
                    {asset1.symbol}
                  </>
                ) : (
                  'Token 1'
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold`}>
                Current: {currentPrice.toFixed(8)}
              </span>
            </div>
          </div>

          {/* Chart */}
          <div className="w-full">
            <LineChart
              data={chartData}
              rangeStart={minPrice}
              rangeEnd={maxPrice}
              currentValue={currentPrice}
              lineColor={isDarkMode ? '#ffffff' : '#000000'}
              rangeColor="#d0de27"
              showRange={true}
              rangeOrientation="horizontal"
              showCurrentLabel={true}
              currentPrice={currentPrice}
            />
          </div>

          {/* Chart Legend */}
          <div className="w-full flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-500"></div>
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

          {/* Token Pair Info */}
          <div
            className={`w-full flex justify-between items-center p-4 rounded-lg ${
              isDarkMode ? 'bg-[#333333]' : 'bg-[#f5f5f5]'
            }`}
          >
            <div className="flex items-center gap-2">
              {asset0 && asset1 && (
                <div className="flex items-center -space-x-2">
                  <Image
                    src={asset0.logoURI}
                    alt={asset0.symbol}
                    className={`w-6 h-6 rounded-full border-2 ${isDarkMode ? 'border-[#211b1b]' : 'border-white'}`}
                    width={24}
                    height={24}
                  />
                  <Image
                    src={asset1.logoURI}
                    alt={asset1.symbol}
                    className={`w-6 h-6 rounded-full border-2 ${isDarkMode ? 'border-[#211b1b]' : 'border-white'}`}
                    width={24}
                    height={24}
                  />
                </div>
              )}
              <span className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold`}>
                {asset0?.symbol || 'Token 0'}/{asset1?.symbol || 'Token 1'}
              </span>
            </div>
            <span
              className={`${isMobile ? 'text-xs' : 'text-sm'} px-3 py-1 rounded ${
                isDarkMode ? 'bg-[#d0de27] text-black' : 'bg-orange-600 text-white'
              }`}
            >
              {feeTier}
            </span>
          </div>

          {/* Price Range */}
          <div className="w-full grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>Min Price</span>
              <span className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold`}>{minPrice.toFixed(8)}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>Max Price</span>
              <span className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold`}>{maxPrice.toFixed(8)}</span>
            </div>
          </div>

          {/* Token Amounts */}
          <div className="w-full grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                {asset0 && (
                  <Image
                    src={asset0.logoURI}
                    alt={asset0.symbol}
                    className="w-4 h-4 rounded-full"
                    width={16}
                    height={16}
                  />
                )}
                <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>
                  {asset0?.symbol || 'Token 0'} Amount
                </span>
              </div>
              <span className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold`}>{amount0 || '0'}</span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                {asset1 && (
                  <Image
                    src={asset1.logoURI}
                    alt={asset1.symbol}
                    className="w-4 h-4 rounded-full"
                    width={16}
                    height={16}
                  />
                )}
                <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>
                  {asset1?.symbol || 'Token 1'} Amount
                </span>
              </div>
              <span className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold`}>{amount1 || '0'}</span>
            </div>
          </div>

          {/* Divider */}
          <hr className={`w-full ${isDarkMode ? 'border-[#333333]' : 'border-[#d9d9d9]'}`} />

          {/* Stats */}
          <div className="w-full flex flex-col gap-3">
            <div className="w-full justify-between items-center flex gap-3">
              <span className={`${isMobile ? 'text-sm' : 'text-base'}`}>TVL</span>
              <span className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold`}>${tvl}</span>
            </div>
            <div className="w-full justify-between items-center flex gap-3">
              <span className={`${isMobile ? 'text-sm' : 'text-base'}`}>Est. earnings</span>
              <span className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold`}>$0.00</span>
            </div>
            <div className="w-full justify-between items-center flex gap-3">
              <span className={`${isMobile ? 'text-sm' : 'text-base'}`}>Current Fee Tier</span>
              <span className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold`}>{feeTier}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CLRangeView;
