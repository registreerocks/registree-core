import { userFromGqlContext } from './graphql.helpers';
import { User } from './interfaces/user.interface';

describe('userFromGqlContext', () => {
  describe('context without user throws error', () => {
    const requestMissingError = Error(
      'userFromGqlContext: request missing from resolver context',
    );
    const userMissingError = Error(
      'userFromGqlContext: user missing from context request (Did authentication middleware run?)',
    );
    test.each([
      [{}, requestMissingError],
      [{ req: undefined }, requestMissingError],
      [{ req: {} }, userMissingError],
      [{ req: { user: undefined } }, userMissingError],
    ])('context: %p', (ctx, expectedError) => {
      expect(() => userFromGqlContext(ctx)).toThrow(expectedError);
    });
  });

  describe('returns user', () => {
    test.each([
      { userId: '2', dbId: '3', scope: 'user scope' },
      {} as User, // Even if the user structure isn't valid, pass it through
    ])('user: %p', (user: User) => {
      const ctx = { req: { user } };
      expect(userFromGqlContext(ctx)).toBe(user);
    });
  });
});
