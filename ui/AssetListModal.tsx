'use client';

import { Modal } from '@/components';
import { MAX_SCREEN_SIZES, Themes } from '@/constants';
import { useAssetList } from '@/context/assets';
import { useWindowDimensions } from '@/hooks/utils';
import { themeAtom } from '@/store';
import { useAtom } from 'jotai';
import { Search, X } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState } from 'react';

interface AssetListModalProps {
  selectedAssets: Set<string>;
  onAssetSelect: (asset: string) => void;
  isOpen?: boolean;
  onClose: () => void;
}

const AssetListModal: React.FC<AssetListModalProps> = ({ isOpen = false, onClose, selectedAssets, onAssetSelect }) => {
  const assets = useAssetList();
  const [theme] = useAtom(themeAtom);
  const isDarkMode = useMemo(() => theme === Themes.DARK, [theme]);
  const dimensions = useWindowDimensions();
  const isMobile = useMemo(() => dimensions.width && dimensions.width <= MAX_SCREEN_SIZES.MOBILE, [dimensions.width]);

  const [searchQuery, setSearchQuery] = useState('');

  const filteredAssets = useMemo(
    () =>
      assets.filter(
        asset =>
          asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          asset.symbol.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
          asset.address.toLowerCase().startsWith(searchQuery.toLowerCase()),
      ),
    [assets, searchQuery],
  );
  return (
    <Modal isOpen={isOpen} onClose={onClose} variant={isDarkMode ? 'secondary' : 'primary'}>
      <div className={`flex flex-col gap-5 w-full px-2 py-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        <div className="w-full flex justify-between items-center gap-3">
          <span>Select a token</span>
          <button
            onClick={onClose}
            className="flex justify-center items-center py-1 px-1 rounded-full w-8 h-8 hover:bg-[#d9d9d9]/60 cursor-pointer"
          >
            <X size={25} />
          </button>
        </div>
        <div className="w-full flex justify-start items-center gap-3 bg-transparent border border-[#ff4500] rounded-lg px-3 py-4">
          <Search size={25} />
          <input
            className="flex-1 outline-0"
            placeholder="Search by name, symbol or address"
            onChange={e => setSearchQuery(e.target.value)}
            value={searchQuery}
          />
        </div>
        <div className="mt-4 flex flex-col justify-center items-center w-full gap-3 py-3 overflow-y-auto h-[calc(100%-22px)]">
          {filteredAssets.map((asset, index) => (
            <button
              key={index}
              onClick={() => onAssetSelect(asset.address)}
              disabled={selectedAssets.has(asset.address)}
              className={`w-full rounded-md outline-0 cursor-pointer ${
                isDarkMode
                  ? !selectedAssets.has(asset.address)
                    ? 'bg-[#1f1f1f]'
                    : 'bg-[#000]'
                  : !selectedAssets.has(asset.address)
                  ? 'bg-[#f5f5f5]'
                  : 'bg-[#dcdcdc]'
              } shadow-lg flex justify-start py-2 px-3`}
            >
              <div className="flex justify-start items-center gap-3 w-full">
                <Image
                  src={asset.logoURI}
                  alt={asset.symbol}
                  className={`${isMobile ? 'w-6 h-6' : 'w-12 h-12'} rounded-full`}
                  width={40}
                  height={40}
                />
                <div className="flex flex-col items-start justify-center gap-1">
                  <h3 className="uppercase text-sm md:text-lg">{asset.symbol}</h3>
                  <span className="text-xs md:text-sm">{asset.name}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default AssetListModal;
