import ql from '@/gql/ql';
import { QUERY_TOKEN_INFO } from '@/gql/queries/tokens';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

function useQLTokenInfo(tokenId: string, refetchInterval: number | false = false) {
  const queryKey = useMemo(() => [`__gql__token:${tokenId}`], [tokenId]);
  const { data } = useQuery({
    queryKey: queryKey,
    queryFn: () => ql(QUERY_TOKEN_INFO, { id: tokenId.toLowerCase() }),
    refetchInterval,
  });
  return data?.data?.token;
}

export default useQLTokenInfo;
