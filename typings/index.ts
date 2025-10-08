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
