import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { IncomingMessage } from 'http';
import { User } from 'src/common/interfaces/user.interface';
import { AuthenticationError } from 'apollo-server-core';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): User => {
    const ctx = GqlExecutionContext.create(context);

    const user = ctx.getContext<{
      req: IncomingMessage & { user?: User };
    }>().req.user;

    if (user) {
      return user;
    } else {
      throw new AuthenticationError(
        'User parameter requested when no user were identified on the request. Ensure that the authentication middleware ran for the request.',
      );
    }
  },
);
