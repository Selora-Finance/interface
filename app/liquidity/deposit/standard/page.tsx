'use client';

import { useAssetList } from '@/context/assets';
import AssetListModal from '@/ui/AssetListModal';
import StandardLiquidityView from '@/ui/liquidity/StandardLiquidityView';
import StandardLiquidityDetails from '@/ui/liquidity/StandardLiquidityDetails';
import { useMemo, useState } from 'react';
import { Address, getAddress, zeroAddress } from 'viem';
import { useRouter } from 'next/navigation';

type PoolType = 'volatile' | 'stable';

export default function StandardLiquidity() {
  const router = useRouter();
  const [address0, setAddress0] = useState<Address>(zeroAddress);
  const [address1, setAddress1] = useState<Address>(zeroAddress);

  const [showModal0, setShowModal0] = useState<boolean>(false);
  const [showModal1, setShowModal1] = useState<boolean>(false);

  const [poolType, setPoolType] = useState<PoolType>('volatile');
  const [amount0, setAmount0] = useState<string>('');
  const [amount1, setAmount1] = useState<string>('');

  // Assets list
  const assets = useAssetList();
  const [asset0, asset1] = useMemo(() => {
    return [assets.find(asset => asset.address === address0), assets.find(asset => asset.address === address1)];
  }, [assets, address0, address1]);

  const handleBackClick = () => {
    router.push('/liquidity/deposit');
  };

  const handleSwitchToConcentrated = () => {
    router.push('/liquidity/deposit/concentrated');
  };

  return (
    <>
      <div className="flex w-svw flex-1 justify-center items-center flex-col gap-4 py-6 md:py-12 my-36 mx-auto relative px-3">
        <StandardLiquidityView
          asset0={asset0}
          asset1={asset1}
          onSelector0Click={() => setShowModal0(true)}
          onSelector1Click={() => setShowModal1(true)}
          onBackClick={handleBackClick}
          onSwitchToConcentrated={handleSwitchToConcentrated}
          poolType={poolType}
          onPoolTypeChange={setPoolType}
          amount0={amount0}
          amount1={amount1}
          onAmount0Change={setAmount0}
          onAmount1Change={setAmount1}
        />
        <StandardLiquidityDetails
          asset0={asset0}
          asset1={asset1}
          amount0={amount0}
          amount1={amount1}
          poolType={poolType}
        />
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
