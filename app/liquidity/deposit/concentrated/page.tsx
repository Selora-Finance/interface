'use client';

import { useAssetList } from '@/context/assets';
import AssetListModal from '@/ui/AssetListModal';
import { ConcentratedLiquidityView, CLRangeView } from '@/ui/liquidity';
import { useMemo, useState } from 'react';
import { Address, getAddress, zeroAddress } from 'viem';
import { useRouter } from 'next/navigation';
import { Settings, ArrowLeft } from 'lucide-react';
import { useWindowDimensions } from '@/hooks/utils';
import { MAX_SCREEN_SIZES } from '@/constants';

type RangePreset = 'passive' | 'wide' | 'narrow' | 'aggressive' | 'intense';

export default function ConcentratedLiquidity() {
  const router = useRouter();
  const [address0, setAddress0] = useState<Address>(zeroAddress);
  const [address1, setAddress1] = useState<Address>(zeroAddress);

  const [showModal0, setShowModal0] = useState<boolean>(false);
  const [showModal1, setShowModal1] = useState<boolean>(false);

  const [feeTier, setFeeTier] = useState<string>('0.25%');
  const [rangeType, setRangeType] = useState<'preset' | 'custom'>('preset');
  const [rangePreset, setRangePreset] = useState<RangePreset>('passive');
  const [amount0, setAmount0] = useState<string>('');
  const [amount1, setAmount1] = useState<string>('');

  // Assets list
  const assets = useAssetList();
  const [asset0, asset1] = useMemo(() => {
    return [assets.find(asset => asset.address === address0), assets.find(asset => asset.address === address1)];
  }, [assets, address0, address1]);

  // Calculate current price (mock)
  const currentPrice = 0.00002454738;

  // Calculate min/max price based on preset
  const { minPrice, maxPrice } = useMemo(() => {
    const presetRanges = {
      passive: 0.5, // +/- 50%
      wide: 0.35, // +/- 35%
      narrow: 0.08, // +/- 8%
      aggressive: 0.01, // +/- 1%
      intense: 0.006, // +/- 0.6%
    };

    const range = presetRanges[rangePreset] || 0.5;
    return {
      minPrice: currentPrice * (1 - range),
      maxPrice: currentPrice * (1 + range),
    };
  }, [rangePreset, currentPrice]);

  const handleBackClick = () => {
    router.push('/liquidity/deposit');
  };

  const handleSwitchToStandard = () => {
    router.push('/liquidity/deposit/standard');
  };

  const dimensions = useWindowDimensions();
  const isMobile = useMemo(() => dimensions.width && dimensions.width <= MAX_SCREEN_SIZES.MOBILE, [dimensions.width]);

  return (
    <>
      <div className="flex w-svw flex-1 justify-center items-start flex-col gap-6 py-6 md:py-12 my-36 mx-auto relative px-3 max-w-[90rem]">
        {/* Title with Settings */}
        <div className="flex justify-between items-center w-full">
          <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold`}>Concentrated Liquidity</h2>
          <button
            onClick={() => {}}
            className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Settings size={20} />
          </button>
        </div>

        {/* Back and Switch to Standard */}
        <div className="flex justify-between items-center w-full">
          <button
            onClick={handleBackClick}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-400 transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <button
            onClick={handleSwitchToStandard}
            className="text-sm text-gray-500 hover:text-gray-400 transition-colors"
          >
            Switch to Standard
          </button>
        </div>

        {/* Two Column Layout */}
        <div className="flex w-full flex-col md:flex-row gap-4 md:gap-6 items-start justify-between">
          <ConcentratedLiquidityView
            asset0={asset0}
            asset1={asset1}
            onSelector0Click={() => setShowModal0(true)}
            onSelector1Click={() => setShowModal1(true)}
            feeTier={feeTier}
            onFeeTierChange={setFeeTier}
            rangeType={rangeType}
            onRangeTypeChange={setRangeType}
            rangePreset={rangePreset}
            onRangePresetChange={setRangePreset}
            amount0={amount0}
            amount1={amount1}
            onAmount0Change={setAmount0}
            onAmount1Change={setAmount1}
            currentPrice={currentPrice}
          />
          <CLRangeView
            asset0={asset0}
            asset1={asset1}
            minPrice={minPrice}
            maxPrice={maxPrice}
            currentPrice={currentPrice}
            amount0={amount0}
            amount1={amount1}
            feeTier={feeTier}
          />
        </div>
      </div>
      <AssetListModal
        isOpen={showModal0}
        selectedAssets={new Set([address0, address1])}
        onAssetSelect={asset => {
          setAddress0(getAddress(asset));
          setShowModal0(false);
        }}
        onClose={() => setShowModal0(false)}
      />
      <AssetListModal
        isOpen={showModal1}
        selectedAssets={new Set([address0, address1])}
        onAssetSelect={asset => {
          setAddress1(getAddress(asset));
          setShowModal1(false);
        }}
        onClose={() => setShowModal1(false)}
      />
    </>
  );
}
