import { paginateArray } from './paginate-array';
import {
  connectionFromArray,
  offsetToCursor,
  cursorToOffset,
} from 'graphql-relay';

describe('paginateArray', () => {
  const ARRAY_LENGTH = 8;
  const data = Array(ARRAY_LENGTH)
    .fill(1)
    .map((_, index) => ({ id: (index + 1).toString() }));

  describe.each([
    { first: 4 },
    { first: 4, after: offsetToCursor(2) },
    { last: 4 },
    { last: 4, before: offsetToCursor(5) },
    { first: ARRAY_LENGTH + 1 },
    { last: ARRAY_LENGTH + 1 },
    { first: 4, after: offsetToCursor(ARRAY_LENGTH + 1) },
    { last: 4, before: offsetToCursor(ARRAY_LENGTH + 1) },
    { last: 4, before: offsetToCursor(0) },
  ])('with %o as args', args => {
    it('should have the same edges as the oracle', () => {
      const result = paginateArray(data, args);
      const oracleResult = connectionFromArray(data, args);
      expect(result.edges).toEqual(oracleResult.edges);
    });
    it('should have the same endCursor as the oracle', () => {
      const result = paginateArray(data, args);
      const oracleResult = connectionFromArray(data, args);
      expect(result.pageInfo.endCursor).toEqual(
        oracleResult.pageInfo.endCursor,
      );
    });
    it('should have the same startCursor as the oracle', () => {
      const result = paginateArray(data, args);
      const oracleResult = connectionFromArray(data, args);
      expect(result.pageInfo.startCursor).toEqual(
        oracleResult.pageInfo.startCursor,
      );
    });
    it('should correctly specify "hasPreviousPage"', () => {
      const { pageInfo } = paginateArray(data, args);
      const hasPreviousPage =
        typeof pageInfo.startCursor === 'string'
          ? cursorToOffset(pageInfo.startCursor) > 0
          : !!args.first;
      expect(pageInfo.hasPreviousPage).toEqual(hasPreviousPage);
    });
    it('should correctly specify "hasNextPage', () => {
      const { pageInfo } = paginateArray(data, args);
      const hasNextPage =
        typeof pageInfo.endCursor === 'string'
          ? cursorToOffset(pageInfo.endCursor) + 1 < ARRAY_LENGTH
          : !!args.last;
      expect(pageInfo.hasNextPage).toEqual(hasNextPage);
    });
  });
});
