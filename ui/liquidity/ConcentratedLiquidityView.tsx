'use client';

import Image from 'next/image';
import { Button, Card } from '@/components';
import { MAX_SCREEN_SIZES, Themes } from '@/constants';
import { themeAtom } from '@/store';
import { AssetType } from '@/typings';
import { useAtom } from 'jotai';
import { ChevronDown, Minus, Plus, Settings } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useWindowDimensions } from '@/hooks/utils';
import { MdSwapVert } from 'react-icons/md';
import SettingsModal from '../SettingsModal';

type RangePreset = 'passive' | 'wide' | 'narrow' | 'aggressive' | 'intense';

interface ConcentratedLiquidityViewProps {
  asset0?: AssetType | null;
  asset1?: AssetType | null;
  onSelector0Click?: () => void;
  onSelector1Click?: () => void;
  onSwitchClick?: () => void;
  feeTier?: string;
  onFeeTierChange?: (tier: string) => void;
  rangeType?: 'preset' | 'custom';
  onRangeTypeChange?: (type: 'preset' | 'custom') => void;
  rangePreset?: RangePreset;
  onRangePresetChange?: (preset: RangePreset) => void;
  amount0?: string;
  amount1?: string;
  onAmount0Change?: (value: string) => void;
  onAmount1Change?: (value: string) => void;
  currentPrice?: number;
  minPrice?: number;
  maxPrice?: number;
  onMinPriceChange?: (value: number) => void;
  onMaxPriceChange?: (value: number) => void;
  onCurrentPriceChange?: (value: number) => void;
}

const ConcentratedLiquidityView: React.FC<ConcentratedLiquidityViewProps> = ({
  asset0,
  asset1,
  onSelector0Click,
  onSelector1Click,
  feeTier = '0.25%',
  onFeeTierChange,
  rangeType = 'preset',
  onRangeTypeChange,
  rangePreset = 'passive',
  onRangePresetChange,
  amount0 = '',
  amount1 = '',
  onAmount0Change,
  onAmount1Change,
  currentPrice = 0,
  minPrice = 0,
  maxPrice = 0,
  onMinPriceChange,
  onMaxPriceChange,
  onCurrentPriceChange,
  onSwitchClick,
}) => {
  const [theme] = useAtom(themeAtom);
  const isDarkMode = useMemo(() => theme === Themes.DARK, [theme]);
  const dimensions = useWindowDimensions();
  const isMobile = useMemo(() => dimensions.width && dimensions.width <= MAX_SCREEN_SIZES.MOBILE, [dimensions.width]);
  const [feeDropdownOpen, setFeeDropdownOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const feeOptions = [
    { value: '0.01%', label: '0.01%', earnsPoints: false },
    { value: '0.05%', label: '0.05%', earnsPoints: false },
    { value: '0.25%', label: '0.25%', earnsPoints: true },
    { value: '1%', label: '1%', earnsPoints: false },
  ];

  const rangePresets: { value: RangePreset; label: string; percentage: string }[] = [
    { value: 'passive', label: 'Passive', percentage: '(+/-50%)' },
    { value: 'wide', label: 'Wide', percentage: '(+/-35%)' },
    { value: 'narrow', label: 'Narrow', percentage: '(+/-8%)' },
    { value: 'aggressive', label: 'Aggressive', percentage: '(+/-1%)' },
    { value: 'intense', label: 'Intense', percentage: '(+/-0.6%)' },
  ];

  const handleInput0Change = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // Change input value
      onAmount0Change?.(e.target.value);
      // Value as number
      const valueAsNumber = parseFloat(e.target.value);
      if (!isNaN(valueAsNumber)) {
        onAmount1Change?.((valueAsNumber * currentPrice).toFixed(6));
      }
    },
    [currentPrice, onAmount0Change, onAmount1Change],
  );

  const handleInput1Change = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // Change input value
      onAmount1Change?.(e.target.value);
      // Value as number
      const valueAsNumber = parseFloat(e.target.value);
      if (!isNaN(valueAsNumber) && currentPrice !== 0) {
        onAmount0Change?.((valueAsNumber / currentPrice).toFixed(6));
      }
    },
    [currentPrice, onAmount0Change, onAmount1Change],
  );

  return (
    <>
      <div className="flex flex-col gap-6 w-full md:w-[48%]">
        <Card
          variant={isDarkMode ? 'neutral' : 'primary'}
          className={`flex justify-center items-start w-full px-4 md:px-6 py-6 md:py-8 ${
            !isDarkMode && 'border border-[#d9d9d9]'
          } text-base md:text-lg`}
        >
          <div className="w-full flex flex-col gap-6 justify-start items-center">
            <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold self-start`}>New CL Position</h3>
            <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500 self-start`}>
              Create a new position by selecting a token pair and defining the fee tier and liquidity range
            </p>

            {/* Token Pair Selection */}
            <div className="w-full flex gap-3">
              <Button
                onClick={onSelector0Click}
                variant={isDarkMode ? 'dark' : 'neutral'}
                className="flex-1 cursor-pointer flex justify-center items-center gap-2 px-3 py-3"
              >
                {asset0 ? (
                  <>
                    <Image
                      src={asset0.logoURI}
                      alt={asset0.symbol}
                      className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} rounded-full`}
                      width={24}
                      height={24}
                    />
                    <span className={`font-light ${isMobile ? 'text-sm' : 'text-base'}`}>{asset0.symbol}</span>
                    <ChevronDown size={isMobile ? 14 : 18} />
                  </>
                ) : (
                  <span className={`font-light ${isMobile ? 'text-sm' : 'text-base'}`}>Select token</span>
                )}
              </Button>
              <button
                onClick={onSwitchClick}
                className={`${
                  isDarkMode ? 'bg-[#333333]' : 'bg-[#fff] border border-[#333333]'
                } rounded-lg outline-0 flex justify-center items-center cursor-pointer py-3 px-3`}
              >
                <MdSwapVert size={isMobile ? 14 : 15} />
              </button>
              <Button
                onClick={onSelector1Click}
                variant={isDarkMode ? 'dark' : 'neutral'}
                className="flex-1 cursor-pointer flex justify-center items-center gap-2 px-3 py-3"
              >
                {asset1 ? (
                  <>
                    <Image
                      src={asset1.logoURI}
                      alt={asset1.symbol}
                      className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} rounded-full`}
                      width={24}
                      height={24}
                    />
                    <span className={`font-light ${isMobile ? 'text-sm' : 'text-base'}`}>{asset1.symbol}</span>
                    <ChevronDown size={isMobile ? 14 : 18} />
                  </>
                ) : (
                  <span className={`font-light ${isMobile ? 'text-sm' : 'text-base'}`}>Select token</span>
                )}
              </Button>
            </div>

            {/* Current Price */}
            <div className="flex flex-col gap-3 items-start w-full">
              <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>Current Price</span>
              <div
                className={`w-full p-4 rounded-lg border flex justify-between items-center ${
                  isDarkMode ? 'bg-[#211b1b] border-[#333333]' : 'bg-white border-[#d9d9d9]'
                }`}
              >
                <input
                  type="number"
                  className="no-spinner bg-transparent outline-0"
                  value={currentPrice}
                  onChange={e => onCurrentPriceChange?.(e.target.valueAsNumber)}
                />
                <span className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold`}>
                  {asset1?.symbol || 'Token0'} per {asset0?.symbol || 'Token1'}
                </span>
              </div>
            </div>

            {/* Fee Tier Selector */}
            <div className="w-full flex flex-col gap-2">
              <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>Fee Tier:</span>
              <div className="relative">
                <button
                  onClick={() => setFeeDropdownOpen(!feeDropdownOpen)}
                  className={`w-full p-4 rounded-lg border flex justify-between items-center ${
                    isDarkMode ? 'bg-[#211b1b] border-[#333333]' : 'bg-white border-[#d9d9d9]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`${isMobile ? 'text-sm' : 'text-base'}`}>{feeTier}</span>
                    {feeOptions.find(opt => opt.value === feeTier)?.earnsPoints && (
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          isDarkMode ? 'bg-[#d0de27] text-black' : 'bg-orange-600 text-white'
                        }`}
                      >
                        Earns Points
                      </span>
                    )}
                  </div>
                  <ChevronDown size={18} />
                </button>
                {feeDropdownOpen && (
                  <div
                    className={`absolute top-full left-0 right-0 mt-2 rounded-lg border overflow-hidden z-10 ${
                      isDarkMode ? 'bg-[#211b1b] border-[#333333]' : 'bg-white border-[#d9d9d9]'
                    }`}
                  >
                    {feeOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => {
                          onFeeTierChange?.(option.value);
                          setFeeDropdownOpen(false);
                        }}
                        className={`w-full p-3 flex justify-between items-center transition-colors ${
                          isDarkMode ? 'hover:bg-[#333333]' : 'hover:bg-[#f5f5f5]'
                        } ${feeTier === option.value ? (isDarkMode ? 'bg-[#333333]' : 'bg-[#f5f5f5]') : ''}`}
                      >
                        <span className={`${isMobile ? 'text-sm' : 'text-base'}`}>{option.label}</span>
                        {option.earnsPoints && (
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              isDarkMode ? 'bg-[#d0de27] text-black' : 'bg-orange-600 text-white'
                            }`}
                          >
                            Earns Points
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Select Range */}
            <div className="w-full flex flex-col gap-3">
              <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>Select Range</span>
              <div className="flex gap-3">
                <button
                  onClick={() => onRangeTypeChange?.('preset')}
                  className={`px-4 py-2 rounded-lg transition-all ${isMobile ? 'text-sm' : 'text-base'} ${
                    rangeType === 'preset'
                      ? isDarkMode
                        ? 'bg-[#d0de27] text-black'
                        : 'bg-orange-600 text-white'
                      : isDarkMode
                      ? 'bg-[#333333] text-white'
                      : 'bg-[#f5f5f5] text-[#000]'
                  }`}
                >
                  Preset Ranges
                </button>
                <button
                  onClick={() => onRangeTypeChange?.('custom')}
                  className={`px-4 py-2 rounded-lg transition-all ${isMobile ? 'text-sm' : 'text-base'} ${
                    rangeType === 'custom'
                      ? isDarkMode
                        ? 'bg-[#d0de27] text-black'
                        : 'bg-orange-600 text-white'
                      : isDarkMode
                      ? 'bg-[#333333] text-white'
                      : 'bg-[#f5f5f5] text-[#000]'
                  }`}
                >
                  Custom Range
                </button>
              </div>
            </div>

            {/* Range Presets */}
            {rangeType === 'preset' && (
              <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-3">
                {rangePresets.map(preset => (
                  <button
                    key={preset.value}
                    onClick={() => onRangePresetChange?.(preset.value)}
                    className={`p-3 rounded-lg border transition-all ${isMobile ? 'text-xs' : 'text-sm'} ${
                      rangePreset === preset.value
                        ? isDarkMode
                          ? 'bg-[#333333] border-[#d0de27] text-white'
                          : 'bg-orange-50 border-orange-600 text-orange-600'
                        : isDarkMode
                        ? 'bg-transparent border-[#333333] text-white hover:border-[#555555]'
                        : 'bg-transparent border-[#d9d9d9] text-[#000] hover:border-[#999999]'
                    }`}
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold">{preset.label}</span>
                      <span className="text-gray-500">{preset.percentage}</span>
                    </div>
                  </button>
                ))}
                <button
                  className={`p-3 rounded-lg border transition-all ${isMobile ? 'text-xs' : 'text-sm'} ${
                    isDarkMode
                      ? 'bg-transparent border-[#333333] text-white hover:border-[#555555]'
                      : 'bg-transparent border-[#d9d9d9] text-[#000] hover:border-[#999999]'
                  }`}
                >
                  Full Range
                </button>
              </div>
            )}

            {/* Custom Range Inputs */}
            {rangeType === 'custom' && (
              <div className="w-full flex flex-col gap-4">
                {/* Labels */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>
                    Min {asset0?.symbol || 'Token0'} per {asset1?.symbol || 'Token1'}
                  </span>
                  <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500 md:block hidden`}>
                    Max {asset0?.symbol || 'Token0'} per {asset1?.symbol || 'Token1'}
                  </span>
                </div>

                {/* Inputs Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Min Price Input Container */}
                  <div
                    className={`flex items-center rounded-lg border ${
                      isDarkMode ? 'bg-[#211b1b] border-[#333333]' : 'bg-white border-[#d9d9d9]'
                    }`}
                  >
                    <button
                      onClick={() => {
                        const decrement = minPrice * 0.01; // 1% decrease
                        onMinPriceChange?.(Math.max(0, minPrice - decrement));
                      }}
                      className={`${
                        isMobile ? 'p-2' : 'p-3'
                      } transition-all flex-shrink-0 cursor-pointer h-full rounded-l-lg ${
                        isDarkMode ? 'hover:bg-[#333333]' : 'hover:bg-[#f5f5f5]'
                      }`}
                    >
                      <Minus size={isMobile ? 14 : 16} className={isDarkMode ? 'text-white' : 'text-black'} />
                      {/* <svg
                      width={isMobile ? '14' : '16'}
                      height={isMobile ? '14' : '16'}
                      viewBox="0 0 16 16"
                      fill="none"
                      className={isDarkMode ? 'text-white' : 'text-black'}
                    >
                      <path d="M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg> */}
                    </button>
                    <input
                      type="number"
                      value={minPrice.toFixed(10)}
                      onChange={e => onMinPriceChange?.(parseFloat(e.target.value) || 0)}
                      className={`flex-1 no-spinner min-w-0 bg-transparent text-center outline-none px-2 py-3 ${
                        isMobile ? 'text-xs' : 'text-base'
                      } ${isDarkMode ? 'text-white' : 'text-black'}`}
                      step="0.0000000001"
                    />
                    <button
                      onClick={() => {
                        const increment = minPrice * 0.01 || 0.0000000001; // 1% increase or minimum
                        onMinPriceChange?.(minPrice + increment);
                      }}
                      className={`${
                        isMobile ? 'p-2' : 'p-3'
                      } transition-all flex-shrink-0 cursor-pointer h-full rounded-r-lg ${
                        isDarkMode ? 'hover:bg-[#333333]' : 'hover:bg-[#f5f5f5]'
                      }`}
                    >
                      <Plus size={isMobile ? 14 : 16} className={isDarkMode ? 'text-white' : 'text-black'} />
                      {/* <svg
                      width={isMobile ? '14' : '16'}
                      height={isMobile ? '14' : '16'}
                      viewBox="0 0 16 16"
                      fill="none"
                      className={isDarkMode ? 'text-white' : 'text-black'}
                    >
                      <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg> */}
                    </button>
                  </div>

                  {/* Mobile: Max Label */}
                  <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500 md:hidden block mt-2`}>
                    Max {asset0?.symbol || 'Token0'} per {asset1?.symbol || 'Token1'}
                  </span>

                  {/* Max Price Input Container */}
                  <div
                    className={`flex items-center rounded-lg border ${
                      isDarkMode ? 'bg-[#211b1b] border-[#333333]' : 'bg-white border-[#d9d9d9]'
                    }`}
                  >
                    <button
                      onClick={() => {
                        const decrement = maxPrice * 0.01; // 1% decrease
                        onMaxPriceChange?.(Math.max(0, maxPrice - decrement));
                      }}
                      className={`${
                        isMobile ? 'p-2' : 'p-3'
                      } transition-all flex-shrink-0 cursor-pointer h-full rounded-l-lg ${
                        isDarkMode ? 'hover:bg-[#333333]' : 'hover:bg-[#f5f5f5]'
                      }`}
                    >
                      <Minus size={isMobile ? 14 : 16} className={isDarkMode ? 'text-white' : 'text-black'} />
                      {/* <svg
                      width={isMobile ? '14' : '16'}
                      height={isMobile ? '14' : '16'}
                      viewBox="0 0 16 16"
                      fill="none"
                      className={isDarkMode ? 'text-white' : 'text-black'}
                    >
                      <path d="M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg> */}
                    </button>
                    <input
                      type="number"
                      value={maxPrice.toFixed(10)}
                      onChange={e => onMaxPriceChange?.(parseFloat(e.target.value) || 0)}
                      className={`flex-1 no-spinner min-w-0 bg-transparent text-center outline-none px-2 py-3 ${
                        isMobile ? 'text-xs' : 'text-base'
                      } ${isDarkMode ? 'text-white' : 'text-black'}`}
                      step="0.0000000001"
                    />
                    <button
                      onClick={() => {
                        const increment = maxPrice * 0.01 || 0.0000000001; // 1% increase or minimum
                        onMaxPriceChange?.(maxPrice + increment);
                      }}
                      className={`${
                        isMobile ? 'p-2' : 'p-3'
                      } transition-all flex-shrink-0 cursor-pointer h-full rounded-r-lg ${
                        isDarkMode ? 'hover:bg-[#333333]' : 'hover:bg-[#f5f5f5]'
                      }`}
                    >
                      <Plus size={isMobile ? 14 : 16} className={isDarkMode ? 'text-white' : 'text-black'} />
                      {/* <svg
                      width={isMobile ? '14' : '16'}
                      height={isMobile ? '14' : '16'}
                      viewBox="0 0 16 16"
                      fill="none"
                      className={isDarkMode ? 'text-white' : 'text-black'}
                    >
                      <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg> */}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Input Amounts */}
            <div className="w-full flex flex-col gap-4">
              <div className="flex justify-between items-center w-full">
                <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>Input Amounts</span>
                <button
                  onClick={() => setShowSettings(true)}
                  className="p-1 rounded hover:bg-gray-700 transition-colors"
                >
                  <Settings size={16} />
                </button>
              </div>

              {/* Token 0 Input */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {/* {asset0 && (
                    <Image
                      src={asset0.logoURI}
                      alt={asset0.symbol}
                      className="w-4 h-4 rounded-full"
                      width={16}
                      height={16}
                    />
                  )} */}
                    <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>
                      {asset0?.symbol || 'Token 0'}
                    </span>
                  </div>
                  <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>0.000 Max</span>
                </div>
                <div
                  className={`border w-full rounded-lg flex justify-start items-center px-3 py-3 gap-2 ${
                    isDarkMode ? 'border-[#333333]' : 'border-[#d9d9d9]'
                  }`}
                >
                  <input
                    type="number"
                    value={amount0}
                    onChange={handleInput0Change}
                    className={`flex-1 bg-transparent outline-0 ${
                      isDarkMode ? 'text-white' : 'text-[#000]'
                    } no-spinner ${isMobile ? 'text-sm' : 'text-base'}`}
                    placeholder="0"
                  />
                  {asset0 && (
                    <Image
                      src={asset0.logoURI}
                      alt={asset0.symbol}
                      className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} rounded-full`}
                      width={24}
                      height={24}
                    />
                  )}
                  <span className={`font-semibold ${isMobile ? 'text-sm' : 'text-base'}`}>
                    {asset0?.symbol || 'Token 0'}
                  </span>
                </div>
              </div>

              {/* Token 1 Input */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {/* {asset1 && (
                    <Image
                      src={asset1.logoURI}
                      alt={asset1.symbol}
                      className="w-4 h-4 rounded-full"
                      width={16}
                      height={16}
                    />
                  )} */}
                    <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>
                      {asset1?.symbol || 'Token 1'}
                    </span>
                  </div>
                  <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>0.000 Max</span>
                </div>
                <div
                  className={`border w-full rounded-lg flex justify-start items-center px-3 py-3 gap-2 ${
                    isDarkMode ? 'border-[#333333]' : 'border-[#d9d9d9]'
                  }`}
                >
                  <input
                    type="number"
                    value={amount1}
                    onChange={handleInput1Change}
                    className={`flex-1 bg-transparent outline-0 ${
                      isDarkMode ? 'text-white' : 'text-[#000]'
                    } no-spinner ${isMobile ? 'text-sm' : 'text-base'}`}
                    placeholder="0"
                  />
                  {asset1 && (
                    <Image
                      src={asset1.logoURI}
                      alt={asset1.symbol}
                      className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} rounded-full`}
                      width={24}
                      height={24}
                    />
                  )}
                  <span className={`font-semibold ${isMobile ? 'text-sm' : 'text-base'}`}>
                    {asset1?.symbol || 'Token 1'}
                  </span>
                </div>
              </div>
            </div>

            {/* Approve Button */}
            <Button variant="primary" className="w-full py-4 text-base md:text-lg font-semibold">
              Approve {asset0?.symbol || 'Token 0'}
            </Button>
          </div>
        </Card>
      </div>
      <SettingsModal show={showSettings} onHide={() => setShowSettings(false)} />
    </>
  );
};

export default ConcentratedLiquidityView;
