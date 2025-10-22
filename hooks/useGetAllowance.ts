import abi from '@/assets/abi/erc20';
import { DEFAULT_PROCESS_DURATION, ETHER } from '@/constants';
import { useState } from 'react';
import { Address, maxUint256, zeroAddress } from 'viem';
import { useAccount, usePublicClient } from 'wagmi';
import { useSetInterval } from './utils';

function useGetAllowance(
  token: Address = ETHER,
  spender: Address = zeroAddress,
  refetchInterval: number = DEFAULT_PROCESS_DURATION,
) {
  const [balance, setBalance] = useState<bigint>(BigInt(0));
  const { address = zeroAddress } = useAccount();
  const publicClient = usePublicClient();

  useSetInterval(async () => {
    if (address === zeroAddress) {
      setBalance(BigInt(0));
      return;
    }
    if (token === zeroAddress || token.toLowerCase() === ETHER.toLowerCase()) {
      setBalance(maxUint256);
      return;
    }

    if (!publicClient) return;
    try {
      const callResult = await publicClient.readContract({
        address: token,
        abi,
        functionName: 'allowance',
        args: [address, spender],
      });
      setBalance(callResult);
    } catch (error: unknown) {
      setBalance(BigInt(0));
      console.error(error);
    }
  }, refetchInterval);

  return balance;
}

export default useGetAllowance;
