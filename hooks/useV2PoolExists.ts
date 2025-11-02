import abi from '@/assets/abi/v2Factory';
import { V2_FACTORY } from '@/constants';
import { useMemo } from 'react';
import { Address, zeroAddress } from 'viem';
import { useChainId, useReadContract } from 'wagmi';

function useV2PoolExists(token0: Address, token1: Address, stable: boolean, refetchInterval: number | false = false) {
  const chainId = useChainId();
  const factory = useMemo(() => V2_FACTORY[chainId], [chainId]);
  const { data } = useReadContract({
    abi,
    functionName: 'getPool',
    address: factory,
    args: [token0, token1, stable],
    query: { refetchInterval, enabled: token0 !== zeroAddress && token1 !== zeroAddress },
  });
  return typeof data !== 'undefined' && data !== zeroAddress;
}

export default useV2PoolExists;
