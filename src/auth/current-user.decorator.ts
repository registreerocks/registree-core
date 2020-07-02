import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { IncomingMessage } from 'http';
import { User } from 'src/common/interfaces/user.interface';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): User => {
    const ctx = GqlExecutionContext.create(context);

    const user = ctx.getContext<{
      req: IncomingMessage & { user?: User };
    }>().req.user;

    if (user) {
      return user;
    } else {
      throw new Error(
        'User parameter requested when no user were identified on the request. Ensure that the correct guards were specified for the method',
      );
    }
  },
);
