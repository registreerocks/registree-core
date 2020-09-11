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

export const appPermissions = shield(
  {
    EventQuery: or(and(isRecruiter, isEventQueryOwner), isAdmin),
    QueryDetails: {
      results: not(isAdmin),
    },
    Mutation: {
      createQuery: isRecruiter,
    },
  },
  {
    debug: false,
    fallbackError: new ForbiddenError('authorization failed'),
  },
);

type ContextWithUser = {
  req: IncomingMessage & {
    user: User;
  };
};
