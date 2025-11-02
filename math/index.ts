import { V3_SQRT_PRICE_BASIS, V3_TICK_BASIS } from '@/constants';

export function normalizeSqrtPriceX96(
  sqrtPriceX96: bigint,
  decimals0: number,
  decimals1: number,
  termsOfSecondToken: boolean = true,
) {
  let priceWithoutBasis: number = Math.pow(
    parseFloat(sqrtPriceX96.toString()) / parseFloat(V3_SQRT_PRICE_BASIS.toString()),
    2,
  );
  priceWithoutBasis = priceWithoutBasis / Math.pow(10, decimals1 - decimals0);
  if (termsOfSecondToken) priceWithoutBasis = 1 / priceWithoutBasis;
  return priceWithoutBasis;
}

export function getTickFromPrice(price: number, tickSpacing: number) {
  const tick = price > 0 ? Math.log(price) / Math.log(V3_TICK_BASIS) : 0;
  return Math.floor(tick / tickSpacing) * tickSpacing;
}
