import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from 'src/common/interfaces/user.interface';
import { userFromGqlContext } from '../common/graphql.helpers';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): User => {
    const ctx = GqlExecutionContext.create(context);
    return userFromGqlContext(ctx.getContext());
  },
);
