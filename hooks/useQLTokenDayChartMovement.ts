import ql from '@/gql/ql';
import { QUERY_TOKEN_DAY_DATA } from '@/gql/queries/tokens';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

function useQLTokenDayChartMovement(tokenId: string, refetchInterval: number | false = false) {
  const queryKey = useMemo(() => [`__gql__token__day__data:${tokenId}`], [tokenId]);
  const { data } = useQuery({
    queryKey: queryKey,
    queryFn: () => ql(QUERY_TOKEN_DAY_DATA, { tokenId }),
    refetchInterval,
  });
  return data?.data?.tokenDayDatas || [];
}

export default useQLTokenDayChartMovement;
