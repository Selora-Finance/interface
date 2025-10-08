'use client';

import { getAssetList } from '@/lib/server/utils';
import { AssetResponseType } from '@/typings';
import { useQuery } from '@tanstack/react-query';
import { useMemo, createContext, useContext } from 'react';
import { useChainId } from 'wagmi';

const AssetsListContext = createContext<AssetResponseType>([]);

export const AssetsListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const chainId = useChainId();
  const queryResult = useQuery({
    queryKey: ['__assets__list__from__github'],
    queryFn: () => getAssetList(chainId),
    refetchInterval: 30_000,
  });
  const assets = useMemo(() => queryResult.data || [], [queryResult.data]);
  return <AssetsListContext.Provider value={assets}>{children}</AssetsListContext.Provider>;
};

export function useAssetList() {
  return useContext(AssetsListContext);
}
