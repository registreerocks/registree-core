import { rule, shield, and, or, not, IRule } from 'graphql-shield';
import { ForbiddenError } from 'apollo-server-express';
import { userFromGqlContext } from './common/graphql.helpers';

const isEventQueryOwner = rule({
  cache: 'strict',
})((parent: Record<string, unknown>, _args, ctx, _info) => {
  const user = userFromGqlContext(ctx);
  return parent?.customerId === user.dbId;
});

/** True if scope contains the given token. */
const scopeContains = (scope: string, scopeToken: string): boolean =>
  // NOTE: Only split on actual space (%x20) characters, not other whitespace,
  // as per https://tools.ietf.org/html/rfc6749#section-3.3
  scope.split(/ +/).includes(scopeToken);

/** The requesting user is authorised with the given scope token. */
const userHasScope: (scopeToken: string) => IRule = scopeToken =>
  rule({ cache: 'contextual' })((_parent, _args, ctx, _info) => {
    const user = userFromGqlContext(ctx);
    return (
      scopeContains(user.scope, scopeToken) ||
      new ForbiddenError('invalid scope')
    );
  });

/** The requesting user is authorised with the recruiter scope. */
export const isRecruiter = userHasScope('recruiter');

/** The requesting user is authorised with the admin (registree) scope. */
export const isAdmin = userHasScope('registree');

/** The requesting user is authorised with the student scope. */
export const isStudent = userHasScope('student');

const userCustomerIdMatchesArgsCustomerId = rule({
  cache: 'contextual',
})((_parent, args: { customerId?: string } | null | undefined, ctx, _info) => {
  if (args?.customerId) {
    const user = userFromGqlContext(ctx);
    return user.dbId === args.customerId;
  } else {
    return new ForbiddenError('customer id not provided');
  }
});

export const appPermissions = shield(
  {
    EventQuery: {
      '*': or(and(isRecruiter, isEventQueryOwner), isAdmin, isStudent),
      currentPrice: not(isStudent),
    },
    EventDetails: {
      invites: not(isRecruiter),
      metrics: not(isStudent),
    },
    Customer: {
      billingDetails: not(isStudent),
      contacts: not(isStudent),
    },
    Quote: not(isStudent),
    QueryDetails: {
      results: not(or(isAdmin, isStudent)),
    },
    Mutation: {
      createQuery: isRecruiter,
      updateBillingDetails: or(
        and(isRecruiter, userCustomerIdMatchesArgsCustomerId),
        isAdmin,
      ),
      updateCustomerDetails: or(
        and(isRecruiter, userCustomerIdMatchesArgsCustomerId),
        isAdmin,
      ),
    },
    Query: {
      getQueries: or(
        and(isRecruiter, userCustomerIdMatchesArgsCustomerId),
        isAdmin,
      ),
      getStudentQueries: isStudent,
    },
  },
  {
    allowExternalErrors: true,
    debug: false,
    fallbackError: new ForbiddenError('authorization failed'),
  },
);
