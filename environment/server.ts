import * as zod from 'zod';
import { createEnv } from '@t3-oss/env-nextjs';

export const {
  GOOGLE_API_KEY,
  GOOGLE_PRIVATE_KEY,
  GOOGLE_SERVICE_ACCOUNT_EMAIL,
  SPREADSHEET_ID,
  GITHUB_TOKEN,
  ASSETS_REPO_SLUG,
  SERVER_GRAPHQL_URI,
} = createEnv({
  client: {},
  server: {
    SPREADSHEET_ID: zod.string().default(''),
    GOOGLE_SERVICE_ACCOUNT_EMAIL: zod.email().toLowerCase().default(''),
    GOOGLE_PRIVATE_KEY: zod.string().default(''),
    GOOGLE_API_KEY: zod.string().default(''),
    GITHUB_TOKEN: zod.string().default(''),
    ASSETS_REPO_SLUG: zod.string().optional().default('assets/src/{chainId}/ERC20/index.json'),
    SERVER_GRAPHQL_URI: zod
      .string()
      .default('https://api.goldsky.com/api/public/project_cm00n85dxah7801vz3y4icpq2/subgraphs/selora/v0.0.1/gn'),
  },
  experimental__runtimeEnv: {
    PUBLIC_SPREADSHEET_ID: process.env.PUBLIC_SPREADSHEET_ID,
    GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    ASSETS_REPO_SLUG: process.env.ASSETS_REPO_SLUG,
    SERVER_GRAPHQL_URI: process.env.SERVER_GRAPHQL_URI,
  },
  emptyStringAsUndefined: true,
  onValidationError: issues => {
    console.error(issues);
    throw Error(
      process.env.NODE_ENV === 'production'
        ? 'Invalid environment variables'
        : 'Continuing with missing environment variables in development',
    );
  },
});
