import ql from '@/gql/ql';
import { QUERY_ALL_POOLS } from '@/gql/queries/pools';
import { useQuery } from '@tanstack/react-query';

function useAllPools(skip: number = 0, limit: number = 2000, refetchInterval: number | false = false) {
  const { data } = useQuery({
    queryKey: ['__gql__all__pools'],
    queryFn: () => ql(QUERY_ALL_POOLS, { skip, limit }),
    refetchInterval,
  });
  return data?.data?.pools || [];
}

export default useAllPools;
