'use client';

import Image from 'next/image';
import { Button, Card, Spinner } from '@/components';
import { MAX_SCREEN_SIZES, Themes } from '@/constants';
import { themeAtom } from '@/store';
import { AssetType } from '@/typings';
import { useAtom } from 'jotai';
import { ChevronDown, Settings } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { MdSwapVert } from 'react-icons/md';
import { useWindowDimensions } from '@/hooks/utils';
import { formatNumber } from '@/lib/client/utils';

interface MainSwapViewProps {
  asset0?: AssetType | null;
  asset1?: AssetType | null;
  onSelector0Click?: () => void;
  onSelector1Click?: () => void;
  onSwitchClick?: () => void;
  onSettingsClick?: () => void;
  onInitiateButtonClick?: () => void;
  token0Balance?: number | string;
  token1Balance?: number | string;
  token0BalanceUSD?: number | string;
  token1BalanceUSD?: number | string;
  isLoading?: boolean;
  needsApproval?: boolean;
  onAmount0Change?: (value: string) => void;
  onAmount1Change?: (value: string) => void;
  amount0?: string;
  amount1?: string;
  currentPrice?: number;
}

const MainSwapView: React.FC<MainSwapViewProps> = ({
  asset0,
  asset1,
  onSelector0Click,
  onSelector1Click,
  onSwitchClick,
  onSettingsClick,
  onInitiateButtonClick,
  token0Balance = 0,
  token1Balance = 0,
  token0BalanceUSD = 0,
  token1BalanceUSD = 0,
  isLoading = false,
  needsApproval,
  onAmount0Change,
  onAmount1Change,
  amount0 = '0',
  amount1 = '0',
  currentPrice = 0,
}) => {
  const [theme] = useAtom(themeAtom);
  const isDarkMode = useMemo(() => theme === Themes.DARK, [theme]);
  const dimensions = useWindowDimensions();
  const isMobile = useMemo(() => dimensions.width && dimensions.width <= MAX_SCREEN_SIZES.MOBILE, [dimensions.width]);

  const balanceIsSufficient = useMemo(() => {
    return Number(token0Balance) >= Number(amount0);
  }, [amount0, token0Balance]);

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
    <div className="flex justify-center items-center w-full md:w-1/4">
      <Card
        variant={isDarkMode ? 'neutral' : 'primary'}
        className={`flex justify-center items-start w-full px-4 py-7 ${
          !isDarkMode && 'border border-[#d9d9d9]'
        } text-lg`}
      >
        <div className="w-full flex flex-col gap-7 justify-start items-center">
          <div className="flex flex-col justify-start items-center gap-4 w-full">
            <div className="flex justify-between items-center w-full">
              <span className="text-sm">Sell</span>
              <button
                onClick={onSettingsClick}
                className="bg-transparent outline-0 flex justify-center items-center cursor-pointer hover:bg-[#dcdcdc]/40 py-1 px-1 rounded-lg"
              >
                <Settings />
              </button>
              <span className="text-sm text-gray-500">
                {' '}
                {formatNumber(token0Balance)} {asset0?.symbol || 'Token0'}
              </span>
            </div>
            <div className="border border-[#333333] w-full rounded-lg flex justify-start items-center px-3 py-3 gap-2">
              <Button
                onClick={onSelector0Click}
                variant={isDarkMode ? 'dark' : 'neutral'}
                className="cursor-pointer flex justify-start items-center gap-1 px-2"
              >
                {asset0 ? (
                  <>
                    <Image
                      src={asset0.logoURI}
                      alt={asset0.symbol}
                      className={`${isMobile ? 'w-4 h-4' : 'w-8 h-8'} rounded-full`}
                      width={20}
                      height={20}
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
                onChange={handleInput0Change}
                value={amount0}
                className={`flex-1 bg-transparent text-right outline-0 ${
                  isDarkMode ? 'text-white' : 'text-[#000]'
                } no-spinner text-xs md:text-lg`}
                placeholder="0.0"
              />
            </div>
            <div className="flex justify-end items-center w-full">
              <span className="text-sm text-gray-500">
                {' '}
                {formatNumber(token0BalanceUSD, undefined, undefined, true)}
              </span>
            </div>
          </div>
          {/* Divider line */}
          <div className="w-full flex relative justify-center items-center my-7">
            <hr className="border-[#333333] w-full" />
            <button
              onClick={onSwitchClick}
              className={`${
                isDarkMode ? 'bg-[#333333]' : 'bg-[#fff] border border-[#333333]'
              } absolute rounded-lg outline-0 flex justify-center items-center cursor-pointer py-3 px-3`}
            >
              <MdSwapVert size={isMobile ? 14 : 15} />
            </button>
          </div>

          <div className="flex flex-col justify-start items-center gap-4 w-full">
            <div className="flex justify-between items-center w-full">
              <span className="text-sm">Buy</span>
              <span className="text-sm text-gray-500">
                {formatNumber(token1Balance)} {asset1?.symbol || 'Token1'}
              </span>
            </div>
            <div className="border border-[#333333] w-full rounded-lg flex justify-start items-center px-3 py-3 gap-2">
              <Button
                onClick={onSelector1Click}
                variant={isDarkMode ? 'dark' : 'neutral'}
                className="cursor-pointer flex justify-start items-center gap-1 px-2"
              >
                {asset1 ? (
                  <>
                    <Image
                      src={asset1.logoURI}
                      alt={asset1.symbol}
                      className={`${isMobile ? 'w-4 h-4' : 'w-8 h-8'} rounded-full`}
                      width={20}
                      height={20}
                    />
                    <span className={`font-light ${isMobile ? 'text-xs' : 'text-lg'}`}>{asset1.symbol}</span>
                    <ChevronDown size={isMobile ? 12 : 20} fontWeight={600} />
                  </>
                ) : (
                  <span className="font-light">Select token</span>
                )}
              </Button>
              <input
                onChange={handleInput1Change}
                value={amount1}
                className={`flex-1 bg-transparent text-right outline-0 ${
                  isDarkMode ? 'text-white' : 'text-[#000]'
                } no-spinner text-xs md:text-lg`}
                placeholder="0.0"
              />
            </div>
            <div className="flex justify-end items-center w-full">
              <span className="text-sm text-gray-500">
                {' '}
                {formatNumber(token1BalanceUSD, undefined, undefined, true)}
              </span>
            </div>
          </div>
          <Button
            disabled={isLoading || amount0.trim().length === 0 || parseFloat(amount0) === 0 || !balanceIsSufficient}
            variant="primary"
            className="w-full py-5 gap-2 flex justify-center items-center"
            onClick={onInitiateButtonClick}
          >
            {balanceIsSufficient ? (
              <>{needsApproval ? `Approve to spend ${asset0?.symbol}` : 'Swap'}</>
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

export default MainSwapView;
