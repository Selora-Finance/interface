'use client';

import { Card } from '@/components';
import { Themes } from '@/constants';
import { formatNumber } from '@/lib/client/utils';
import { routerTypeAtom, slippageToleranceAtom, themeAtom } from '@/store';
import { AssetType } from '@/typings';
import { useAtom } from 'jotai';
import { useMemo } from 'react';

interface SwapDetailsProps {
  asset0?: AssetType | null;
  asset1?: AssetType | null;
  asset1PerAsset0?: number | string;
  priceImpact?: number | string;
  minReceived?: number | string;
}

const SwapDetails: React.FC<SwapDetailsProps> = ({ asset0, asset1, asset1PerAsset0, priceImpact, minReceived }) => {
  const [theme] = useAtom(themeAtom);
  const [slippageTolerance] = useAtom(slippageToleranceAtom);
  const [routerType] = useAtom(routerTypeAtom);
  const isDarkMode = useMemo(() => theme === Themes.DARK, [theme]);
  return (
    <div className="flex justify-center items-center w-full md:w-1/4">
      <Card
        variant={isDarkMode ? 'neutral' : 'primary'}
        className={`flex justify-center items-start w-full px-4 py-7 ${
          !isDarkMode && 'border border-[#d9d9d9]'
        } text-lg`}
      >
        <div className="flex flex-col justify-start w-full items-center gap-4">
          <div className="w-full justify-between items-center flex gap-3">
            <span className="text-sm text-gray-500">Slippage Tolerance</span>
            <span className="text-sm">{slippageTolerance}%</span>
          </div>
          <div className="w-full justify-between items-center flex gap-3">
            <span className="text-sm text-gray-500">Exchange Rate</span>
            <span className="text-sm">
              {!!asset0 && !!asset1 && !!asset1PerAsset0 ? (
                <>
                  {formatNumber(asset1PerAsset0)} {asset1.symbol} per {asset0.symbol}
                </>
              ) : (
                '--'
              )}
            </span>
          </div>
          <div className="w-full justify-between items-center flex gap-3">
            <span className="text-sm text-gray-500">Price Impact</span>
            <span className="text-sm">{`${priceImpact ? formatNumber(priceImpact) + '%' : '--'}`}</span>
          </div>
          <div className="w-full justify-between items-center flex gap-3">
            <span className="text-sm text-gray-500">Minimum Received</span>
            <span className="text-sm">{minReceived ? `${formatNumber(minReceived)} ${asset1?.symbol}` : '--'}</span>
          </div>
          <div className="w-full justify-between items-center flex gap-3">
            <span className="text-sm text-gray-500">Router</span>
            <span className="text-[#d0de27] text-sm">{routerType}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SwapDetails;
