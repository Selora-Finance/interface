import axios from 'axios';
import { type ExecutionResult, print } from 'graphql';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { NEXT_PUBLIC_GRAPHQL_SCHEMA_URI } from '@/environment/client';

export async function ql<R, V>(
  query: TypedDocumentNode<R, V>,
  ...[variables]: V extends Record<string, never> ? [] : [V]
) {
  const response = await axios.post(
    NEXT_PUBLIC_GRAPHQL_SCHEMA_URI,
    { query: print(query), variables },
    { headers: { Accept: 'application/graphql-response+json' } },
  );
  return response.data as ExecutionResult<R>;
}

export default ql;
