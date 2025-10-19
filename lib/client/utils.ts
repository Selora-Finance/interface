import { Pool } from '@/gql/codegen/graphql';
import { AssetType, PoolData } from '@/typings';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * cn - className helper
 * Combines multiple class strings, removes duplicates, and merges Tailwind classes.
 */
export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(
  num: number | string,
  locales: Intl.LocalesArgument = 'en-US',
  maximumFracts: number = 3,
  inUSD: boolean = false,
) {
  if (typeof num === 'string') num = parseFloat(num);

  const opts: Intl.NumberFormatOptions = {};

  opts.trailingZeroDisplay = 'stripIfInteger';
  opts.maximumFractionDigits = maximumFracts;
  opts.notation = 'compact';
  opts.compactDisplay = 'short';

  if (inUSD) {
    opts.style = 'currency';
    opts.currency = 'USD';
  }

  return new Intl.NumberFormat(locales, opts).format(num);
}

export function mapGQLPool(gqlPools: Pool[], assetLookupFunction?: (id?: string) => AssetType | undefined): PoolData[] {
  return gqlPools.map(pool => {
    const asset0 = assetLookupFunction?.(pool.token0?.id);
    const asset1 = assetLookupFunction?.(pool.token1?.id);
    const data: PoolData = {
      id: pool.id as string,
      volume: formatNumber(pool.volumeUSD as string, undefined, 4, true),
      tvl: formatNumber(pool.reserveUSD as string, undefined, 4, true),
      token0: {
        symbol: pool.token0?.symbol as string,
        logoURI: asset0?.logoURI || '',
        amount: formatNumber(pool.volumeToken0 as string, undefined, 4),
      },
      token1: {
        symbol: pool.token1?.symbol as string,
        logoURI: asset1?.logoURI || '',
        amount: formatNumber(pool.volumeToken1 as string, undefined, 4),
      },
      fees: formatNumber(pool.totalFeesUSD as string, undefined, 4, true),
      feeAmounts: {
        token0: formatNumber(pool.totalFees0 as string, undefined, 4),
        token1: formatNumber(pool.totalFees1 as string, undefined, 4),
      },
      reserves: {
        token0: formatNumber(pool.reserve0 as string, undefined, 4),
        token1: formatNumber(pool.reserve1 as string, undefined, 4),
      },
      type: pool.poolType?.toLowerCase() as 'concentrated' | 'stable' | 'volatile',
      apr: `${formatNumber(pool.gauge?.rewardRate || '0', undefined, 2)}%`,
      feeRate: '0%',
    };
    return data;
  });
}
