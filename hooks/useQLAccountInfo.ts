import ql from '@/gql/ql';
import { QUERY_ACCOUNT_INFO } from '@/gql/queries/account';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { zeroAddress } from 'viem';
import { useAccount } from 'wagmi';

function useQLAccountInfo(refetchInterval: number | false = false) {
  const { address = zeroAddress } = useAccount();
  const queryKey = useMemo(() => [`__gql__pool:${address}`], [address]);
  const { data } = useQuery({
    queryKey,
    queryFn: () => ql(QUERY_ACCOUNT_INFO, { id: address.toLowerCase() }),
    refetchInterval,
  });
  return data?.data?.user;
}

export default useQLAccountInfo;
