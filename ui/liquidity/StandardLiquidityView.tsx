'use client';

import Image from 'next/image';
import { Button, Card, Spinner } from '@/components';
import { MAX_SCREEN_SIZES, Themes } from '@/constants';
import { themeAtom } from '@/store';
import { AssetType } from '@/typings';
import { useAtom } from 'jotai';
import { ChevronDown, Settings, ArrowLeft } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { useWindowDimensions } from '@/hooks/utils';
import { formatNumber } from '@/lib/client/utils';

type PoolType = 'volatile' | 'stable';

interface StandardLiquidityViewProps {
  asset0?: AssetType | null;
  asset1?: AssetType | null;
  token0Balance?: number | string;
  token1Balance?: number | string;
  token0BalanceUSD?: number | string;
  token1BalanceUSD?: number | string;
  onSelector0Click?: () => void;
  onSelector1Click?: () => void;
  onBackClick?: () => void;
  onSwitchToConcentrated?: () => void;
  onSettingsClick?: () => void;
  poolType?: PoolType;
  onPoolTypeChange?: (type: PoolType) => void;
  amount0?: string;
  amount1?: string;
  onAmount0Change?: (value: string) => void;
  onAmount1Change?: (value: string) => void;
  currentQuote?: number;
  needsApproval?: boolean;
  asset0NeedsApproval?: boolean;
  onInitiateButtonClick?: () => void;
  isLoading?: boolean;
}

const StandardLiquidityView: React.FC<StandardLiquidityViewProps> = ({
  asset0,
  asset1,
  onSelector0Click,
  onSelector1Click,
  onBackClick,
  onSwitchToConcentrated,
  onSettingsClick,
  poolType = 'volatile',
  onPoolTypeChange,
  amount0 = '0',
  amount1 = '0',
  onAmount0Change,
  onAmount1Change,
  currentQuote,
  needsApproval,
  asset0NeedsApproval,
  onInitiateButtonClick,
  isLoading,
  token0Balance = 0,
  token1Balance = 0,
  token0BalanceUSD = 0,
  token1BalanceUSD = 0,
}) => {
  const [theme] = useAtom(themeAtom);
  const isDarkMode = useMemo(() => theme === Themes.DARK, [theme]);
  const dimensions = useWindowDimensions();
  const isMobile = useMemo(() => dimensions.width && dimensions.width <= MAX_SCREEN_SIZES.MOBILE, [dimensions.width]);

  const balanceIsSufficient = useMemo(() => {
    return Number(token0Balance) >= Number(amount0) && Number(token1Balance) >= Number(amount1);
  }, [amount0, amount1, token0Balance, token1Balance]);

  const handleInput0Change = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // Change input value
      onAmount0Change?.(e.target.value);
      // Value as number
      const valueAsNumber = parseFloat(e.target.value);
      if (!isNaN(valueAsNumber) && typeof currentQuote !== 'undefined' && currentQuote !== 0) {
        onAmount1Change?.((valueAsNumber * currentQuote).toFixed(6));
      }
    },
    [currentQuote, onAmount0Change, onAmount1Change],
  );

  const handleInput1Change = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // Change input value
      onAmount1Change?.(e.target.value);
      // Value as number
      const valueAsNumber = parseFloat(e.target.value);
      if (!isNaN(valueAsNumber) && typeof currentQuote !== 'undefined' && currentQuote !== 0) {
        onAmount0Change?.((valueAsNumber / currentQuote).toFixed(6));
      }
    },
    [currentQuote, onAmount0Change, onAmount1Change],
  );

  return (
    <div className="flex flex-col gap-6 w-full md:w-1/4">
      {/* Title with Settings */}
      <div className="flex justify-between items-center w-full">
        <h2
          className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold ${!isDarkMode ? 'text-[#000]' : 'text-white'}`}
        >
          Standard Liquidity
        </h2>
        <button
          onClick={onSettingsClick}
          className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <Settings size={20} color={!isDarkMode ? '#000' : '#fff'} />
        </button>
      </div>

      {/* Back and Switch to Concentrated */}
      <div className="flex justify-between items-center w-full">
        <button
          onClick={onBackClick}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-400 transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <button
          onClick={onSwitchToConcentrated}
          className="text-sm text-gray-500 hover:text-gray-400 transition-colors"
        >
          Switch to Concentrated
        </button>
      </div>

      <Card
        variant={isDarkMode ? 'neutral' : 'primary'}
        className={`flex justify-center items-start w-full px-4 md:px-6 py-6 md:py-8 ${
          !isDarkMode && 'border border-[#d9d9d9]'
        } text-base md:text-lg`}
      >
        <div className="w-full flex flex-col gap-6 justify-start items-center">
          {/* Token Input 1 */}
          <div className="flex flex-col justify-start items-center gap-2 w-full">
            <div className="flex justify-between items-center w-full">
              <span className="text-sm">Input</span>
              <span className="text-sm text-gray-500">
                {formatNumber(token0Balance)} {asset0?.symbol || 'Token0'}
              </span>
            </div>
            <div
              className={`border w-full rounded-lg flex justify-start items-center px-3 py-3 gap-2 ${
                isDarkMode ? 'border-[#333333]' : 'border-[#d9d9d9]'
              }`}
            >
              <Button
                onClick={onSelector0Click}
                variant={isDarkMode ? 'dark' : 'neutral'}
                className="cursor-pointer flex justify-start items-center gap-2 px-2"
              >
                {asset0 ? (
                  <>
                    <Image
                      src={asset0.logoURI}
                      alt={asset0.symbol}
                      className={`${isMobile ? 'w-4 h-4' : 'w-8 h-8'} rounded-full`}
                      width={24}
                      height={24}
                    />
                    <span className={`font-light ${isMobile ? 'text-xs' : 'text-lg'}`}>{asset0.symbol}</span>
                    <ChevronDown size={isMobile ? 12 : 20} fontWeight={600} />
                  </>
                ) : (
                  <span className="font-light">Select token</span>
                )}
              </Button>
              <input
                type="number"
                value={amount0}
                onChange={handleInput0Change}
                className={`flex-1 bg-transparent text-right outline-0 ${
                  isDarkMode ? 'text-white' : 'text-[#000]'
                } no-spinner ${isMobile ? 'text-sm' : 'text-base'}`}
                placeholder="0"
              />
            </div>
            <span className="text-xs text-gray-500 self-end">
              {formatNumber(token0BalanceUSD, undefined, undefined, true)}
            </span>
          </div>

          {/* Token Input 2 */}
          <div className="flex flex-col justify-start items-center gap-2 w-full">
            <div className="flex justify-between items-center w-full">
              <span className="text-sm">Input</span>
              <span className="text-sm text-gray-500">
                {formatNumber(token1Balance)} {asset1?.symbol || 'Token1'}
              </span>
            </div>
            <div
              className={`border w-full rounded-lg flex justify-start items-center px-3 py-3 gap-2 ${
                isDarkMode ? 'border-[#333333]' : 'border-[#d9d9d9]'
              }`}
            >
              <Button
                onClick={onSelector1Click}
                variant={isDarkMode ? 'dark' : 'neutral'}
                className="cursor-pointer flex justify-start items-center gap-2 px-2"
              >
                {asset1 ? (
                  <>
                    <Image
                      src={asset1.logoURI}
                      alt={asset1.symbol}
                      className={`${isMobile ? 'w-4 h-4' : 'w-8 h-8'} rounded-full`}
                      width={24}
                      height={24}
                    />
                    <span className={`font-light ${isMobile ? 'text-xs' : 'text-lg'}`}>{asset1.symbol}</span>
                    <ChevronDown size={isMobile ? 12 : 20} fontWeight={600} />
                  </>
                ) : (
                  <span className="font-light">Select token</span>
                )}
              </Button>
              <input
                type="number"
                value={amount1}
                onChange={handleInput1Change}
                className={`flex-1 bg-transparent text-right outline-0 ${
                  isDarkMode ? 'text-white' : 'text-[#000]'
                } no-spinner ${isMobile ? 'text-sm' : 'text-base'}`}
                placeholder="0"
              />
            </div>
            <span className="text-xs text-gray-500 self-end">
              {formatNumber(token1BalanceUSD, undefined, undefined, true)}
            </span>
          </div>

          {/* Pool Type Selection */}
          <div className="flex gap-3 w-full">
            <button
              onClick={() => onPoolTypeChange?.('volatile')}
              className={`flex-1 py-3 rounded-lg border transition-all ${isMobile ? 'text-sm' : 'text-base'} ${
                poolType === 'volatile'
                  ? isDarkMode
                    ? 'bg-[#333333] border-[#d0de27] text-white'
                    : 'bg-orange-50 border-orange-600 text-orange-600'
                  : isDarkMode
                  ? 'bg-transparent border-[#333333] text-white hover:border-[#555555]'
                  : 'bg-transparent border-[#d9d9d9] text-[#000] hover:border-[#999999]'
              }`}
            >
              Volatile
            </button>
            <button
              onClick={() => onPoolTypeChange?.('stable')}
              className={`flex-1 py-3 rounded-lg border transition-all ${isMobile ? 'text-sm' : 'text-base'} ${
                poolType === 'stable'
                  ? isDarkMode
                    ? 'bg-[#333333] border-[#d0de27] text-white'
                    : 'bg-orange-50 border-orange-600 text-orange-600'
                  : isDarkMode
                  ? 'bg-transparent border-[#333333] text-white hover:border-[#555555]'
                  : 'bg-transparent border-[#d9d9d9] text-[#000] hover:border-[#999999]'
              }`}
            >
              Stable
            </button>
          </div>

          {/* Add Liquidity Button */}
          <Button
            variant="primary"
            className="w-full py-4 text-base md:text-lg font-semibold gap-2 flex justify-center items-center"
            onClick={onInitiateButtonClick}
            disabled={
              isLoading ||
              amount0.trim().length === 0 ||
              amount1.trim().length === 0 ||
              parseFloat(amount0) === 0 ||
              parseFloat(amount1) === 0 ||
              !balanceIsSufficient
            }
          >
            {balanceIsSufficient ? (
              <>
                {needsApproval ? (
                  <>
                    {asset0NeedsApproval ? `Approve to spend ${asset0?.symbol}` : `Approve to spend ${asset1?.symbol}`}
                  </>
                ) : (
                  'Add Liquidity'
                )}
              </>
            ) : (
              'Insufficient Balance'
            )}
            {isLoading && <Spinner size="sm" />}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default StandardLiquidityView;
