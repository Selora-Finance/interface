import { isAddress, zeroAddress } from 'viem';
import * as zod from 'zod';

export const StandardLiquidityQuerySchema = zod.object({
  token0: zod
    .string()
    .refine(arg => isAddress(arg))
    .optional()
    .default(zeroAddress),
  token1: zod
    .string()
    .refine(arg => isAddress(arg))
    .optional()
    .default(zeroAddress),
  poolType: zod.enum(['stable', 'volatile']).optional().default('volatile'),
});

export const ConcentratedLiquidityQuerySchema = StandardLiquidityQuerySchema.omit({ poolType: true }).extend({
  tickSpacing: zod.coerce.number().optional(),
  tokenId: zod.coerce.bigint().optional(),
});

export type StandardLiquidityQueryType = zod.infer<typeof StandardLiquidityQuerySchema>;
export type ConcentratedLiquidityQueryType = zod.infer<typeof ConcentratedLiquidityQuerySchema>;
