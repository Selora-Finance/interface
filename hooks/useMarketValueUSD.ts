import { BI_ZERO, ORACLE } from '@/constants';
import { useMemo } from 'react';
import { Address, zeroAddress } from 'viem';
import { useChainId, useReadContract } from 'wagmi';
import abi from '@/assets/abi/oracle';

function useMarketValueUSD(token: Address, value: bigint, refetchInterval: number | false = false) {
  const chainId = useChainId();
  const oracle = useMemo(() => ORACLE[chainId], [chainId]);
  const { data = [BI_ZERO, BI_ZERO] } = useReadContract({
    abi,
    functionName: 'getAverageValueInUSD',
    args: [token, value],
    address: oracle,
    query: { refetchInterval, enabled: token !== zeroAddress && value > BI_ZERO },
  });
  return data;
}

export default useMarketValueUSD;
