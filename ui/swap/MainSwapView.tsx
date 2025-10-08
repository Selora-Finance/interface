'use client';

import Image from 'next/image';
import { Button, Card } from '@/components';
import { MAX_SCREEN_SIZES, Themes } from '@/constants';
import { themeAtom } from '@/store';
import { AssetType } from '@/typings';
import { useAtom } from 'jotai';
import { ChevronDown, Settings } from 'lucide-react';
import { useMemo } from 'react';
import { MdSwapVert } from 'react-icons/md';
import { useWindowDimensions } from '@/hooks/utils';

interface MainSwapViewProps {
  asset0?: AssetType | null;
  asset1?: AssetType | null;
  onSelector0Click?: () => void;
  onSelector1Click?: () => void;
  onSwitchClick?: () => void;
}

const MainSwapView: React.FC<MainSwapViewProps> = ({
  asset0,
  asset1,
  onSelector0Click,
  onSelector1Click,
  onSwitchClick,
}) => {
  const [theme] = useAtom(themeAtom);
  const isDarkMode = useMemo(() => theme === Themes.DARK, [theme]);
  const dimensions = useWindowDimensions();
  const isMobile = useMemo(() => dimensions.width && dimensions.width <= MAX_SCREEN_SIZES.MOBILE, [dimensions.width]);
  return (
    <div className="flex flex-col justify-start items-center w-full md:w-1/4">
      <Card
        variant={isDarkMode ? 'neutral' : 'primary'}
        className={`flex justify-center items-start w-full px-4 py-7 ${
          !isDarkMode && 'border border-[#d9d9d9]'
        } text-lg`}
      >
        <div className="w-full flex flex-col gap-7 justify-start items-center">
          <div className="flex flex-col justify-start items-center gap-4 w-full">
            <div className="flex justify-between items-center w-full">
              <span>Sell</span>
              <button className="bg-transparent outline-0 flex justify-center items-center cursor-pointer hover:bg-[#dcdcdc]/40 py-1 px-1 rounded-lg">
                <Settings />
              </button>
              <span>0.0 ETH</span>
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
                className={`flex-1 bg-transparent text-right outline-0 ${
                  isDarkMode ? 'text-white' : 'text-[#000]'
                } no-spinner text-xs md:text-lg`}
                placeholder="0.0"
              />
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
              <MdSwapVert size={30} />
            </button>
          </div>

          <div className="flex flex-col justify-start items-center gap-4 w-full">
            <div className="flex justify-between items-center w-full">
              <span>Buy</span>
              <span>0.0 ETH</span>
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
                className={`flex-1 bg-transparent text-right outline-0 ${
                  isDarkMode ? 'text-white' : 'text-[#000]'
                } no-spinner text-xs md:text-lg`}
                placeholder="0.0"
              />
            </div>
          </div>
          <Button variant="primary" className="w-full py-5">
            Swap
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default MainSwapView;
