import { isAddress } from 'viem';
import * as zod from 'zod';

export const AssetResponseSchema = zod.array(
  zod
    .object({
      name: zod.string(),
      address: zod.string().refine(arg => isAddress(arg)),
      symbol: zod.string(),
      logoURI: zod.union([zod.url().min(1), zod.base64().min(1)]),
      decimals: zod.int().max(2 ** 8),
      chainId: zod.int(),
    })
    .strict(),
);

export type AssetType = zod.infer<typeof AssetResponseSchema.element>;
export type AssetResponseType = zod.infer<typeof AssetResponseSchema>;

export type Composition = {
  bytes: `0x${string}`;
  value?: bigint;
};

export interface PositionData {
  id: string;
  token0: {
    symbol: string;
    logoURI: string;
    amount?: string;
  };
  token1: {
    symbol: string;
    logoURI: string;
    amount?: string;
  };
  tvl: string;
  apr: string;
  yourDeposit: string;
  staked: string;
  feeRate: string;
  type: 'basic' | 'concentrated' | 'stable' | 'volatile';
  hasPoints?: boolean;
  pointsText?: string;
  poolTvl?: {
    token0: string;
    token1: string;
  };
}

export interface PoolData {
  id: string;
  token0: {
    symbol: string;
    logoURI: string;
    amount?: string;
    id?: string;
  };
  token1: {
    symbol: string;
    logoURI: string;
    amount?: string;
    id?: string;
  };
  tvl: string;
  volume: string;
  fees: string;
  apr: string;
  feeRate: string;
  type: 'concentrated' | 'stable' | 'volatile';
  hasPoints?: boolean;
  pointsText?: string;
  feeAmounts?: {
    token0: string;
    token1: string;
  };
  reserves?: {
    token0: string;
    token1: string;
  };
  tickSpacing?: number | null;
}
