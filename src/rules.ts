import { rule, shield, and, or, not } from 'graphql-shield';
import { User } from './common/interfaces/user.interface';
import { IncomingMessage } from 'http';

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
  return req.user.scope === 'recruiter';
});

const isAdmin = rule({
  cache: 'contextual',
})((_parent, _args, { req }: ContextWithUser, _info) => {
  return req.user.scope === 'registree';
});

export const appPermissions = shield({
  EventQuery: or(and(isRecruiter, isEventQueryOwner), isAdmin),
  QueryDetails: {
    results: not(isAdmin),
  },
});

type ContextWithUser = {
  req: IncomingMessage & {
    user: User;
  };
};
