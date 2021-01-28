import type { ValidationError } from 'class-validator';
import { ApolloError } from 'apollo-server-express';

export class ArgumentValidationError extends ApolloError {
  constructor(public validationErrors: ValidationError[]) {
    super('Argument Validation Error', 'VALIDATION_ERROR');
  }
}
