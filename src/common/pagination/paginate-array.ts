import {
  ConnectionArguments,
  Connection,
  cursorToOffset,
  offsetToCursor,
} from 'graphql-relay';
import { ApolloError } from 'apollo-server-core';

export function paginateArray<Model extends { id: string }>(
  source: Model[],
  args: ConnectionArguments,
): Connection<Model> {
  const { offset, limit } = getOffsetAndLimit(args, source.length);
  const edges = source.slice(offset, offset + limit).map((value, index) => ({
    cursor: offsetToCursor(offset + index),
    node: value,
  }));

  return {
    edges,
    pageInfo: {
      startCursor: edges[0]?.cursor || null,
      endCursor: edges[edges.length - 1]?.cursor || null,
      hasNextPage: source.length > offset + limit,
      hasPreviousPage: offset > 0,
    },
  };
}

function getOffsetAndLimit(
  args: ConnectionArguments,
  arrayLength: number,
  maxLimit: number = Number.POSITIVE_INFINITY,
): { limit: number; offset: number } {
  const { direction, limit } = getLimit(args, maxLimit);
  const offset = getOffset(args);

  switch (direction) {
    case 'forward':
      return { offset: offset || 0, limit };
    case 'backward':
      const endOffset = Math.min(offset ?? arrayLength, arrayLength);
      const startOffset = Math.max(endOffset - limit, 0);
      return {
        offset: startOffset,
        limit: startOffset === 0 ? endOffset : limit,
      };
  }
}

function getOffset({ before, after }: ConnectionArguments): number | null {
  if (before) {
    return cursorToOffset(before);
  } else if (after) {
    return cursorToOffset(after) + 1;
  } else {
    return null;
  }
}

function getLimit(
  { first, last }: ConnectionArguments,
  max: number,
): {
  direction: 'forward' | 'backward';
  limit: number;
} {
  if (first && first > 0) {
    return { direction: 'forward', limit: Math.min(max, first) };
  } else if (last && last > 0) {
    return { direction: 'backward', limit: Math.min(max, last) };
  } else {
    throw new ApolloError(
      'Argument "first" or "last" must be a non-negative integer',
      'VALIDATION_ERROR',
    );
  }
}
