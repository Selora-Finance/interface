import type { CodegenConfig } from '@graphql-codegen/cli';
import { SERVER_GRAPHQL_URI } from './environment/server';

const config: CodegenConfig = {
  schema: SERVER_GRAPHQL_URI,
  documents: ['./gql/queries/**/*.ts'],
  ignoreNoDocuments: true,
  generates: {
    './gql/codegen/': {
      preset: 'client',
      config: {
        enumsAsTypes: true,
      },
    },
    './gql/schema.graphql': {
      plugins: ['schema-ast'],
      config: {
        includeDirectives: true,
      },
    },
  },
};

export default config;
