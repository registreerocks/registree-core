import { Catch, ArgumentsHost } from '@nestjs/common';
import { GqlArgumentsHost, GqlContextType } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-express';
import { BaseExceptionFilter } from '@nestjs/core';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ServerError } from './common/errors/server.error';

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
    if (err instanceof ApolloError) {
      // expected errors
      return err;
    } else if (err instanceof ServerError) {
      return this.handleUnexpectedError(
        err.baseError,
        err.handlerClass,
        err.handler,
      );
    } else {
      return this.handleUnexpectedError(err);
    }
  }

  private handleUnexpectedError(
    err: unknown,
    context?: string,
    handler?: string,
  ): ApolloError {
    try {
      if (context) {
        this.logger.setContext(context);
      }
      if (err instanceof Error) {
        this.logger.error({ err, handler }, 'Unexpected error thrown');
        return new ApolloError(
          'Internal Server Error',
          'INTERNAL_SERVER_ERROR',
          err,
        );
      } else {
        // something that is not an error were thrown
        this.logger.error(
          { throwObject: err, handler },
          'Object thrown that is not an error',
        );
        return new ApolloError(
          'Internal Server Error',
          'INTERNAL_SERVER_ERROR',
        );
      }
    } finally {
      this.logger.setContext(this.loggerContext);
    }
  }
}
