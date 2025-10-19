import ql from '@/gql/ql';
import { QUERY_STATS } from '@/gql/queries/statistics';
import { useQuery } from '@tanstack/react-query';

function useStats(refetchInterval: number | false = false) {
  const { data } = useQuery({
    queryKey: ['__gql__stats'],
    queryFn: () => ql(QUERY_STATS),
    refetchInterval,
  });
  return data?.data?.statistics;
}

export default useStats;
