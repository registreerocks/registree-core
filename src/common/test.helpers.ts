/**
 * Common helper code for tests.
 */

import { gql } from 'apollo-server-core'; // eslint-disable-line @typescript-eslint/no-unused-vars
import {
  DocumentNode,
  ExecutionResult,
  graphql,
  GraphQLError,
  GraphQLSchema,
  printError,
} from 'graphql';

/**
 * Like {@link graphql }, but accept a {@link DocumentNode DocumentNode} as query,
 * and throw on error.
 *
 * This should provide tests with a nicer interface for testing GraphQL queries.
 *
 * @param schema Should be the result of `app.get(GraphQLSchemaHost).schema`
 * @param query Should be the result of a {@link gql} template literal.
 * @param variableValues Optional variable values.
 *
 * @throws any underlying execution result error(s)
 *
 * @see https://docs.nestjs.com/graphql/quick-start#accessing-generated-schema
 */
export async function execGraphQL(
  schema: GraphQLSchema,
  query: DocumentNode,
  variableValues?: { [key: string]: unknown } | undefined,
): Promise<ExecutionResult> {
  // Get the query source.
  if (query.loc === undefined) {
    throw new TypeError('execGraphQL: query.loc undefined');
  }
  const source: string = query.loc.source.body;

  // Throw error(s), if any.
  const result: ExecutionResult = await graphql({
    schema,
    source,
    variableValues,
  });
  if (result.errors) {
    const errors: ReadonlyArray<GraphQLError> = result.errors;
    if (errors.length === 0) {
      /* istanbul ignore next: This shouldn't happen unless graphql() breaks. */
      throw TypeError('execGraphQL: empty result.errors');
    } else if (errors.length === 1) {
      const [err] = errors;
      throw err;
    } else {
      const message: string = ['execGraphQL: Multiple errors:']
        .concat(errors.map(printError))
        .join('\n\n');
      throw Error(message);
    }
  }

  return result;
}
