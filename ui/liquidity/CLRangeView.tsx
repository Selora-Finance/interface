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
  feeTier = '0.25%',
  onRangeChange,
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

  // Generate chart data with realistic price movement using Geometric Brownian Motion
  const chartData = useMemo(() => {
    const data = [];
    const totalPoints = 200; // More data points for smoother visualization
    const daysOfHistory = 30; // 30 days of historical data

    // Start date (X days ago)
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysOfHistory);

    // Simulation parameters for realistic price movement
    const dt = 1 / (totalPoints / daysOfHistory); // Time step (fraction of a day)
    const volatility = 0.15; // 15% annual volatility
    const drift = 0.05; // 5% annual drift (slight upward trend)

    // Initialize with a starting price (slightly lower than current)
    let price = currentPrice * 0.85;

    // Add trend phases for more realism
    const trendPhases = [
      { start: 0, end: 0.3, bias: -0.02 }, // Initial decline
      { start: 0.3, end: 0.6, bias: 0.03 }, // Recovery
      { start: 0.6, end: 0.85, bias: -0.01 }, // Consolidation with slight decline
      { start: 0.85, end: 1.0, bias: 0.02 }, // Recent uptrend to current price
    ];

    // Support and resistance levels for more realistic bounces
    const supportLevel = currentPrice * 0.75;
    const resistanceLevel = currentPrice * 1.15;

    for (let i = 0; i < totalPoints; i++) {
      const progress = i / totalPoints;

      // Determine current trend phase
      let phaseBias = 0;
      for (const phase of trendPhases) {
        if (progress >= phase.start && progress < phase.end) {
          phaseBias = phase.bias;
          break;
        }
      }

      // Generate random component (Wiener process)
      const randomShock = (Math.random() - 0.5) * 2;

      // Geometric Brownian Motion formula with trend bias
      const dPrice = price * ((drift + phaseBias) * dt + volatility * Math.sqrt(dt) * randomShock);
      price = price + dPrice;

      // Add mean reversion near support/resistance
      if (price < supportLevel) {
        price = supportLevel + (price - supportLevel) * 0.3 + Math.random() * currentPrice * 0.02;
      } else if (price > resistanceLevel) {
        price = resistanceLevel - (resistanceLevel - price) * 0.3 - Math.random() * currentPrice * 0.02;
      }

      // Add micro-structure (intraday patterns)
      const microNoise = Math.sin(i * 0.5) * currentPrice * 0.003;
      price += microNoise;

      // Ensure price stays within reasonable bounds
      price = Math.max(supportLevel * 0.95, Math.min(resistanceLevel * 1.05, price));

      // Calculate timestamp for this point (hourly intervals)
      const pointDate = new Date(startDate);
      pointDate.setHours(startDate.getHours() + (i * daysOfHistory * 24) / totalPoints);

      data.push({
        x: pointDate.getTime(),
        y: price,
        date: pointDate,
      });
    }

    // Ensure the last few points converge to current price for realism
    const convergencePoints = 10;
    for (let i = totalPoints - convergencePoints; i < totalPoints; i++) {
      const idx = data.length - (totalPoints - i);
      const convergenceFactor = (i - (totalPoints - convergencePoints)) / convergencePoints;
      data[idx].y = data[idx].y * (1 - convergenceFactor) + currentPrice * convergenceFactor;
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
          {/* Header Section */}
          <div className="w-full flex flex-col gap-4">
            <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold`}>Visualize range</h3>
            <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>
              View your range against the price and liquidity distribution.
            </p>
            <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div className="flex items-center gap-2">
                <span className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-500`}>
                  {asset0?.symbol || 'ETH'} price in {asset1?.symbol || 'CEDA'}
                </span>
                <button className="p-1 rounded hover:bg-gray-700 transition-colors">
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
                </button>
              </div>
              <span className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold`}>
                Current: {currentPrice.toFixed(5)} {asset0?.symbol || 'ETH'}/{asset1?.symbol || 'CEDA'}
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
                  {asset0?.symbol || 'ETH'}/{asset1?.symbol || 'CEDA'}
                </span>
              </div>
              <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>{feeTier}</span>
            </div>

            {/* Min Price and Max Price Cards */}
            <div className="w-full grid grid-cols-2 gap-3">
              <div className={`flex flex-col gap-2 p-3 rounded-lg ${isDarkMode ? 'bg-[#0d0a0a]' : 'bg-[#e8e8e8]'}`}>
                <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>Min Price</span>
                <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-normal`}>
                  {minPrice.toFixed(4)} {asset0?.symbol || 'ETH'}/{asset1?.symbol || 'CEDA'}
                </span>
              </div>
              <div className={`flex flex-col gap-2 p-3 rounded-lg ${isDarkMode ? 'bg-[#0d0a0a]' : 'bg-[#e8e8e8]'}`}>
                <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>Max Price</span>
                <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-normal`}>
                  {maxPrice.toFixed(4)} {asset0?.symbol || 'ETH'}/{asset1?.symbol || 'CEDA'}
                </span>
              </div>
            </div>

            {/* Token Amount Cards */}
            <div className="w-full grid grid-cols-2 gap-3">
              <div className={`flex flex-col gap-2 p-3 rounded-lg ${isDarkMode ? 'bg-[#0d0a0a]' : 'bg-[#e8e8e8]'}`}>
                <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>
                  {asset0?.symbol || 'ETH'} Amount
                </span>
                <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-normal`}>{amount0 || '0'}</span>
              </div>
              <div className={`flex flex-col gap-2 p-3 rounded-lg ${isDarkMode ? 'bg-[#0d0a0a]' : 'bg-[#e8e8e8]'}`}>
                <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>
                  {asset1?.symbol || 'CEDA'} Amount
                </span>
                <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-normal`}>{amount1 || '0'}</span>
              </div>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="w-full flex flex-col gap-3 pt-4">
            <div className="w-full justify-between items-center flex gap-3">
              <span className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-500`}>TVL</span>
              <span className={`${isMobile ? 'text-sm' : 'text-base'} font-normal`}>$4,429,338.56</span>
            </div>
            <div className="w-full justify-between items-center flex gap-3">
              <span className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-500`}>Est. earnings</span>
              <span className={`${isMobile ? 'text-sm' : 'text-base'} font-normal`}>$0.00</span>
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
