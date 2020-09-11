import { Request, Response } from 'express';
import { authenticate } from 'passport';
import { User } from 'src/common/interfaces/user.interface';
import { IMiddlewareFunction } from 'graphql-middleware';
import { GraphQLResolveInfo } from 'graphql';
import { AuthenticationError } from 'apollo-server-express';

export const gqlAuthMiddleware: IMiddlewareFunction<
  unknown,
  { req: Request; res: Response },
  unknown
> = async (resolve, root, args, context, info: GraphQLResolveInfo) => {
  const passportFn = createPassportContext(context.req, context.res);
  try {
    const user = await passportFn(
      'jwt',
      { session: false },
      (err, user, info, ctx, status) =>
        handleRequest(err, user, info, ctx, status),
    );
    context.req.user = user;
    return resolve(root, args, context, info) as unknown;
  } catch (err) {
    throw err;
  }
};

const handleRequest = (
  err,
  user: User | false,
  info: Record<string, string> | null,
  _context,
  _status,
): User => {
  if (err || !user) {
    throw (
      err || new AuthenticationError(info?.message || 'authentication failed')
    );
  }
  return user;
};

/* eslint-disable */
const createPassportContext = (request: Request, response) => (
  type,
  options,
  callback: (...args: any[]) => User,
): Promise<User> => {
  return new Promise<User>((resolve, reject) =>
    authenticate(type, options, (err, user, info, status) => {
      try {
        request.authInfo = info;
        return resolve(callback(err, user, info, status));
      } catch (err) {
        reject(err);
      }
    })(request, response, err => (err ? reject(err) : resolve())),
  );
};
/* eslint-enable */
