// environment/client.ts
import * as zod from 'zod';
import { createEnv } from '@t3-oss/env-nextjs';

export const { NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID, NEXT_PUBLIC_GRAPHQL_SCHEMA_URI } = createEnv({
  client: {
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: zod.string(),
    NEXT_PUBLIC_GRAPHQL_SCHEMA_URI: zod
      .string()
      .default('https://api.goldsky.com/api/public/project_cm00n85dxah7801vz3y4icpq2/subgraphs/selora/v0.0.1/gn'),
  },
  server: {},
  runtimeEnv: {
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    NEXT_PUBLIC_GRAPHQL_SCHEMA_URI: process.env.NEXT_PUBLIC_GRAPHQL_SCHEMA_URI,
  },
  emptyStringAsUndefined: true,
  onValidationError: issues => {
    console.error('Client environment validation errors:', issues);
    throw new Error(
      process.env.NODE_ENV === 'production'
        ? 'Invalid client environment variables'
        : 'Continuing with missing client environment variables in development',
    );
  },
});
