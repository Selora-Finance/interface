import abi from '@/assets/abi/v3Factory';
import { V3_FACTORY } from '@/constants';
import { useMemo } from 'react';
import { Address, zeroAddress } from 'viem';
import { useChainId, useReadContract } from 'wagmi';

function useV3PoolExists(
  token0: Address,
  token1: Address,
  tickSpacing: number,
  refetchInterval: number | false = false,
) {
  const chainId = useChainId();
  const factory = useMemo(() => V3_FACTORY[chainId], [chainId]);
  const { data } = useReadContract({
    abi,
    functionName: 'getPool',
    address: factory,
    args: [token0, token1, tickSpacing],
    query: { refetchInterval, enabled: token0 !== zeroAddress && token1 !== zeroAddress },
  });
  return typeof data !== 'undefined' && data !== zeroAddress;
}

export default useV3PoolExists;
