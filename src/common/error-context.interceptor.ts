import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  ContextType,
} from '@nestjs/common';
import { Observable, MonoTypeOperatorFunction, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApolloError } from 'apollo-server-core';
import { WrappedError } from './errors/wrapped.error';

@Injectable()
export class ErrorContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const meta = {
      handlerClass: context.getClass().name,
      handler: context.getHandler().name,
      contextType: context.getType(),
    };
    return next.handle().pipe(this.rxjsErrorHandler(meta));
  }

  rxjsErrorHandler({
    handlerClass,
    handler,
    contextType,
  }: {
    handlerClass: string;
    handler: string;
    contextType: ContextType;
  }): MonoTypeOperatorFunction<void> {
    return catchError(err => {
      if (err instanceof ApolloError) {
        return throwError(err);
      } else if (err instanceof HttpException && contextType === 'http') {
        return throwError(err);
      } else {
        return throwError(new WrappedError(err, handlerClass, handler));
      }
    });
  }
}
