import { DEFAULT_PROCESS_DURATION, ETHER } from '@/constants';
import abi from '@/assets/abi/erc20';
import { useState } from 'react';
import { Address, zeroAddress } from 'viem';
import { useSetInterval } from './utils';
import { useAccount, usePublicClient } from 'wagmi';

function useGetBalance(token: Address = ETHER, refetchInterval: number = DEFAULT_PROCESS_DURATION) {
  const [balance, setBalance] = useState<bigint>(BigInt(0));
  const { address = zeroAddress } = useAccount();
  const publicClient = usePublicClient();

  useSetInterval(async () => {
    if (address === zeroAddress) {
      setBalance(BigInt(0));
      return;
    }

    if (token === zeroAddress) {
      setBalance(BigInt(0));
      return;
    }

    if (!publicClient) {
      setBalance(BigInt(0));
      return;
    }
    try {
      if (token.toLowerCase() === ETHER.toLowerCase()) {
        const accountBalance = await publicClient.getBalance({ address });
        setBalance(accountBalance);
      } else {
        const callResult = await publicClient.readContract({
          address: token,
          abi,
          functionName: 'balanceOf',
          args: [address],
        });
        setBalance(callResult);
      }
    } catch (error: unknown) {
      setBalance(BigInt(0));
      console.error(error);
    }
  }, refetchInterval);

  return balance;
}

export default useGetBalance;
