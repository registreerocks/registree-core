import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, MonoTypeOperatorFunction, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApolloError } from 'apollo-server-core';
import { ServerError } from './errors/server.error';

@Injectable()
export class ErrorContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const meta = {
      handlerClass: context.getClass().name,
      handler: context.getHandler().name,
    };
    return next.handle().pipe(this.rxjsErrorHandler(meta));
  }

  rxjsErrorHandler({
    handlerClass,
    handler,
  }: {
    handlerClass: string;
    handler: string;
  }): MonoTypeOperatorFunction<void> {
    return catchError(err => {
      if (err instanceof ApolloError) {
        return throwError(err);
      } else {
        return throwError(new ServerError(err, handlerClass, handler));
      }
    });
  }
}
