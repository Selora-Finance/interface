import { BASE_POINT } from '@/constants';
import { LiquidityPosition, Pool } from '@/gql/codegen/graphql';
import { AssetType, PoolData, PositionData } from '@/typings';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * cn - className helper
 * Combines multiple class strings, removes duplicates, and merges Tailwind classes.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export function isValidNonZeroNumberString(numberString: string) {
  const valueAsNumber = Number(numberString);
  return !isNaN(valueAsNumber) && valueAsNumber > 0;
}

function replaceZerosWithSubscript(str: string) {
  return str.replace(/0{4,}/g, match => {
    const count = match.length;
    const subscriptDigits: { [key: string]: string } = {
      '0': '₀',
      '1': '₁',
      '2': '₂',
      '3': '₃',
      '4': '₄',
      '5': '₅',
      '6': '₆',
      '7': '₇',
      '8': '₈',
      '9': '₉',
    };
    const subscriptCount = count
      .toString()
      .split('')
      .map(d => subscriptDigits[d])
      .join('');
    return `0${subscriptCount}`;
  });
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
  opts.maximumSignificantDigits = 6;
  opts.notation = 'compact';
  opts.compactDisplay = 'short';
  opts.useGrouping = num < 1000000000000;

  if (inUSD) {
    opts.style = 'currency';
    opts.currency = 'USD';
  }

  return replaceZerosWithSubscript(new Intl.NumberFormat(locales, opts).format(num));
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
        id: pool.token0.id,
      },
      token1: {
        symbol: pool.token1?.symbol as string,
        logoURI: asset1?.logoURI || '',
        amount: formatNumber(pool.volumeToken1 as string, undefined, 4),
        id: pool.token1.id,
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
      tickSpacing: pool.tickSpacing,
    };
    return data;
  });
}

export function calculatePositionPercentage(position: string | number, totalSupply: string | number) {
  if (typeof position === 'string') position = parseFloat(position);
  if (typeof totalSupply === 'string') totalSupply = parseFloat(totalSupply);
  return totalSupply > 0 ? position / totalSupply : 0;
}

export function mapGQLUserLiquidityPositions(
  gqlPositions: LiquidityPosition[],
  assetLookupFunction?: (id?: string) => AssetType | undefined,
): PositionData[] {
  return gqlPositions.map(position => {
    const asset0 = assetLookupFunction?.(position.pool.token0?.id);
    const asset1 = assetLookupFunction?.(position.pool.token1?.id);
    const positionPercentage = calculatePositionPercentage(position.position, position.pool.totalSupply);
    const token0Amount = positionPercentage * parseFloat(position.pool.reserve0);
    const token1Amount = positionPercentage * parseFloat(position.pool.reserve1);
    const positionUSD = positionPercentage * parseFloat(position.pool.reserveUSD);

    const data: PositionData = {
      id: position.id,
      tvl: formatNumber(position.pool.reserveUSD as string, undefined, 4, true),
      token0: {
        symbol: position.pool.token0?.symbol as string,
        logoURI: asset0?.logoURI || '',
        amount: formatNumber(token0Amount, undefined, 4),
        id: position.pool.token0.id,
      },
      token1: {
        symbol: position.pool.token1?.symbol as string,
        logoURI: asset1?.logoURI || '',
        amount: formatNumber(token1Amount, undefined, 4),
        id: position.pool.token1.id,
      },
      yourDeposit: formatNumber(positionUSD, undefined, 4, true),
      poolTvl: {
        token0: formatNumber(position.pool.reserve0),
        token1: formatNumber(position.pool.reserve1),
      },
      staked: '0',
      type: position.pool.poolType.toLowerCase() as 'concentrated' | 'stable' | 'volatile',
      feeRate: '0',
      apr: `${formatNumber(position.pool.gauge?.rewardRate || '0', undefined, 2)}%`,
    };
    return data;
  });
}

export function applySlippage(slippage: number, originalAmount: bigint | number): bigint {
  if (typeof originalAmount === 'number') originalAmount = BigInt(originalAmount);
  const slippageAsBP = BigInt(slippage * BASE_POINT);
  const BIT = (slippageAsBP * originalAmount) / BigInt(100 * BASE_POINT);
  return originalAmount - BIT;
}

export function determinePriceImpact(
  reserve0: string | number,
  reserve1: string | number,
  inputAmount: string | number,
  expectedOutput: string | number,
): number {
  if (typeof reserve0 === 'string') reserve0 = parseFloat(reserve0);
  if (typeof reserve1 === 'string') reserve1 = parseFloat(reserve1);
  if (typeof inputAmount === 'string') inputAmount = parseFloat(inputAmount);
  if (typeof expectedOutput === 'string') expectedOutput = parseFloat(expectedOutput);

  if (isNaN(reserve0) || isNaN(reserve1) || isNaN(inputAmount) || isNaN(expectedOutput)) return 0;

  const inputPerOutput = expectedOutput > 0 ? inputAmount / expectedOutput : 0;
  const marketPrice = reserve1 > 0 ? reserve0 / reserve1 : 0;
  const difference = inputPerOutput - marketPrice;
  return marketPrice > 0 ? Math.abs(difference / marketPrice) * 100 : 0;
}
