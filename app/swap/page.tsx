'use client';

import { useAssetList } from '@/context/assets';
import AssetListModal from '@/ui/AssetListModal';
import SettingsModal from '@/ui/SettingsModal';
import MainSwapView from '@/ui/swap/MainSwapView';
import SwapDetails from '@/ui/swap/SwapDetails';
import { useCallback, useMemo, useState } from 'react';
import { Address, getAddress, zeroAddress } from 'viem';

export default function Swap() {
  const [address0, setAddress0] = useState<Address>(zeroAddress);
  const [address1, setAddress1] = useState<Address>(zeroAddress);

  const [showModal0, setShowModal0] = useState<boolean>(false);
  const [showModal1, setShowModal1] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const onSwitchClick = useCallback(() => {
    const mutableAddress0 = address0;
    const mutableAddress1 = address1;
    setAddress0(mutableAddress1);
    setAddress1(mutableAddress0);
  }, [address0, address1]);

  // Assets list
  const assets = useAssetList();
  const [asset0, asset1] = useMemo(() => {
    return [assets.find(asset => asset.address === address0), assets.find(asset => asset.address === address1)];
  }, [assets, address0, address1]);
  return (
    <>
      <div className="flex w-svw flex-1 justify-center items-center flex-col gap-4 py-6 md:py-12 my-36 mx-auto relative px-3">
        <MainSwapView
          asset0={asset0}
          asset1={asset1}
          onSelector0Click={() => setShowModal0(true)}
          onSelector1Click={() => setShowModal1(true)}
          onSwitchClick={onSwitchClick}
          onSettingsClick={() => setShowSettings(true)}
        />
        <SwapDetails />
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
      <SettingsModal show={showSettings} onHide={() => setShowSettings(false)} />
    </>
  );
}
