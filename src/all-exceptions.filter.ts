import { Catch, ArgumentsHost } from '@nestjs/common';
import { GqlArgumentsHost, GqlContextType } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-express';
import { BaseExceptionFilter } from '@nestjs/core';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { WrappedError } from './common/errors/wrapped.error';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly loggerContext = AllExceptionsFilter.name;

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
    if (
      err instanceof ApolloError &&
      err.extensions.code &&
      err.extensions.code !== 'INTERNAL_SERVER_ERROR'
    ) {
      // expected errors
      return err;
    } else if (err instanceof WrappedError) {
      return this.handleUnexpectedError(err.baseError, err.handlerClass);
    } else if (err instanceof Error) {
      return this.handleUnexpectedError(err);
    } else {
      // something that is not an error were thrown
      this.logger.error(
        { throwObject: err },
        'Object thrown that is not an error',
      );
      return new ApolloError('Internal Server Error', 'INTERNAL_SERVER_ERROR');
    }
  }

  private handleUnexpectedError(err: Error, context?: string): ApolloError {
    try {
      if (context) {
        this.logger.setContext(context);
      }
      this.logger.error({ err }, 'Unexpected error thrown');
      return new ApolloError(
        'Internal Server Error',
        'INTERNAL_SERVER_ERROR',
        err,
      );
    } finally {
      this.logger.setContext(this.loggerContext);
    }
  }
}
