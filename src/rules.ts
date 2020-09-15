import { rule, shield, and, or, not } from 'graphql-shield';
import { User } from './common/interfaces/user.interface';
import { IncomingMessage } from 'http';
import { ForbiddenError } from 'apollo-server-express';

const isEventQueryOwner = rule({
  cache: 'strict',
  fragment: 'fragment getId on EventQuery{customerId}',
})(
  (parent: Record<string, unknown>, _args, { req }: ContextWithUser, _info) => {
    return parent?.customerId === req.user.dbId;
  },
);

const isRecruiter = rule({
  cache: 'contextual',
})((_parent, _args, { req }: ContextWithUser, _info) => {
  return req.user.scope === 'recruiter'
    ? true
    : new ForbiddenError('invalid scope');
});

const isAdmin = rule({
  cache: 'contextual',
})((_parent, _args, { req }: ContextWithUser, _info) => {
  return req.user.scope === 'registree'
    ? true
    : new ForbiddenError('invalid scope');
});

const isStudent = rule({
  cache: 'contextual',
})((_parent, _args, { req }: ContextWithUser, _info) => {
  return req.user.scope === 'student'
    ? true
    : new ForbiddenError('invalid scope');
});

export const appPermissions = shield(
  {
    EventQuery: {
      currentPrice: not(isStudent),
    },
    EventDetails: {
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
    },
    Query: {
      getQueries: or(and(isRecruiter, isEventQueryOwner), isAdmin),
      getStudentQueries: isStudent,
    },
  },
  {
    debug: true,
    // fallbackError: new ForbiddenError('authorization failed'),
  },
);

type ContextWithUser = {
  req: IncomingMessage & {
    user: User;
  };
};
