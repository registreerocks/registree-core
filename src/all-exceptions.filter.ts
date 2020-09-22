import { Catch, ArgumentsHost } from '@nestjs/common';
import { GqlArgumentsHost, GqlContextType } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-express';
import { BaseExceptionFilter } from '@nestjs/core';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  constructor(
    @InjectPinoLogger(AllExceptionsFilter.name)
    private readonly logger: PinoLogger,
  ) {
    super();
  }

  catch(err: unknown, host: ArgumentsHost): ApolloError | void {
    if (host.getType<GqlContextType>() === 'graphql') {
      const gqlHost = GqlArgumentsHost.create(host);
      return this.handleGqlError(err, gqlHost);
    } else {
      return super.catch(err, host);
    }
  }

  private handleGqlError(
    err: unknown,
    _gqlHost: GqlArgumentsHost,
  ): ApolloError {
    if (err instanceof ApolloError) {
      // expected errors
      return err;
    } else if (err instanceof Error) {
      // unexpected errors
      this.logger.error({ err }, 'Unexpected error thrown');
      return new ApolloError(
        'Internal Server Error',
        'INTERNAL_SERVER_ERROR',
        err,
      );
    } else {
      // something that is not an error were thrown
      this.logger.error(
        { throwObject: err },
        'Object thrown that is not an error',
      );
      return new ApolloError('Internal Server Error', 'INTERNAL_SERVER_ERROR');
    }
  }
}
