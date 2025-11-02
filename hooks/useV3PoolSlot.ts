import { Address, zeroAddress } from 'viem';
import useV3Pool from './useV3Pool';
import { BI_ZERO, REFETCH_INTERVALS } from '@/constants';
import abi from '@/assets/abi/v3Pool';
import { useReadContract } from 'wagmi';

function useV3PoolSlot(token0: Address, token1: Address, tickSpacing: number) {
  const pool = useV3Pool(token0, token1, tickSpacing, REFETCH_INTERVALS);
  const { data = [BI_ZERO, 0, 0, 0, 0, false] } = useReadContract({
    abi,
    address: pool,
    functionName: 'slot0',
    query: { enabled: pool !== zeroAddress },
  });

  return data;
}

export default useV3PoolSlot;
