import ql from '@/gql/ql';
import { QUERY_SINGLE_POOL } from '@/gql/queries/pools';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

function useQLPoolInfo(poolId: string, refetchInterval: number | false = false) {
  const queryKey = useMemo(() => [`__gql__pool:${poolId}`], [poolId]);
  const { data } = useQuery({
    queryKey: queryKey,
    queryFn: () => ql(QUERY_SINGLE_POOL, { id: poolId.toLowerCase() }),
    refetchInterval,
  });
  return data?.data?.pool;
}

export default useQLPoolInfo;
