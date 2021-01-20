import { User } from './interfaces/user.interface';

/**
 * Check and get the user from the GraphQL resolver context.
 *
 * @throw {Error} If the context has no user.
 */
export function userFromGqlContext(ctx: { req?: { user?: User } }): User {
  if (!ctx.req) {
    throw new Error(
      'userFromGqlContext: request missing from resolver context',
    );
  } else if (!ctx.req.user) {
    throw new Error(
      'userFromGqlContext: user missing from context request (Did authentication middleware run?)',
    );
  } else {
    return ctx.req.user;
  }
}
