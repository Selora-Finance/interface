import * as zod from 'zod';
import { createEnv } from '@t3-oss/env-nextjs';

export const { GOOGLE_API_KEY, GOOGLE_PRIVATE_KEY, GOOGLE_SERVICE_ACCOUNT_EMAIL, SPREADSHEET_ID } = createEnv({
  client: {},
  server: {
    SPREADSHEET_ID: zod.string(),
    GOOGLE_SERVICE_ACCOUNT_EMAIL: zod.email().toLowerCase(),
    GOOGLE_PRIVATE_KEY: zod.string(),
    GOOGLE_API_KEY: zod.string(),
  },
  experimental__runtimeEnv: {
    PUBLIC_SPREADSHEET_ID: process.env.PUBLIC_SPREADSHEET_ID,
    GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
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
