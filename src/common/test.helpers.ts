/**
 * Common helper code for tests.
 */

import { gql } from 'apollo-server-core'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { validate, ValidationError } from 'class-validator';
import {
  DocumentNode,
  ExecutionResult,
  graphql,
  GraphQLArgs,
  GraphQLError,
  GraphQLSchema,
  printError,
  Source,
} from 'graphql';
import mockedEnv from 'mocked-env';

/** Wrap {@link validate} to return any validation errors as an error message string. */
// Suppress warning: "Object" matches the type of class-validator's validate()
// eslint-disable-next-line @typescript-eslint/ban-types
export async function validateToErrorMessage(object: Object): Promise<string> {
  return (await validate(object))
    .map((e: ValidationError) => e.toString())
    .join('');
}

/** True for objects with the given prototype. */
const hasPrototype = (o, prototype): o is InstanceType<typeof prototype> =>
  typeof o === 'object' && o !== null && Object.getPrototypeOf(o) === prototype;

/**
 * True for null prototype objects, as returned by `Object.create(null)`).
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create#custom_and_null_objects
 */
export const hasNullPrototype = (
  o: unknown,
): o is Record<keyof never, unknown> => hasPrototype(o, null);

/**
 * True for "plain" objects, but not null prototype objects.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create#custom_and_null_objects
 */
export const hasObjectPrototype = (
  o: unknown,
): o is Record<keyof never, unknown> => hasPrototype(o, Object.prototype);

/**
 * Return a mixed object tree with null prototype objects coerced to plain objects.
 *
 * This primarily intended to work around the problem of graphql-js using
 * null prototype objects to represent maps.
 *
 * @see https://github.com/graphql/graphql-js/issues/484
 */
export function coerceNullPrototypeObjects(o: unknown): unknown {
  if (hasNullPrototype(o) || hasObjectPrototype(o)) {
    return Object.fromEntries(
      Object.entries(o).map(([k, v]) => [k, coerceNullPrototypeObjects(v)]),
    );
  } else if (Array.isArray(o)) {
    return Array.from(o, v => coerceNullPrototypeObjects(v));
  } else {
    return o;
  }
}

/**
 * Like {@link graphql }, but accept a {@link DocumentNode DocumentNode} as query,
 * and throw on error.
 *
 * This should provide tests with a nicer interface for testing GraphQL queries.
 *
 * @param schema Should be the result of `app.get(GraphQLSchemaHost).schema`
 * @param query Query source, or the result of a {@link gql} template literal.
 * @param args Same as {@link graphql}
 *
 * @throws any underlying execution result error(s)
 *
 * @see https://docs.nestjs.com/graphql/quick-start#accessing-generated-schema
 */
export async function execGraphQL(
  schema: GraphQLSchema,
  query: GraphQLArgs['source'] | DocumentNode,
  args?: Omit<GraphQLArgs, 'schema' | 'source'>,
): Promise<ExecutionResult> {
  // Get the query source.
  function extractSource(query: DocumentNode): Source {
    if (query.loc === undefined)
      throw new TypeError('execGraphQL: DocumentNode query has no loc');
    return query.loc.source;
  }
  const source: GraphQLArgs['source'] =
    typeof query === 'string' || query instanceof Source
      ? query
      : extractSource(query);

  const result: ExecutionResult = await graphql({ schema, source, ...args });

  // Throw error(s), if any.
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

/**
 * Generic test helpers.
 */

/**
 * Run `body` with a mocked `process.env`.
 *
 * This will clear and then restore the original environment.
 *
 * @example
 * withMockedEnv({NODE_ENV: 'test'}, () => {
 *   // …
 * })
 *
 * @return the result of `body`
 * @see mockedEnv
 */
export function withMockedEnv<R>(
  env: Record<string, string | undefined>,
  body: () => R,
): R {
  const restoreEnv = mockedEnv(env, { clear: true });
  try {
    return body();
  } finally {
    restoreEnv();
  }
}

/** True if all the given keys of `env` have values. */
export function hasAllKeys(
  env: Record<string, unknown>,
  keys: Array<string>,
): boolean {
  return keys.every(k => env[k]);
}
