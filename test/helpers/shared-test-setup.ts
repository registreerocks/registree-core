/**
 * Shared set-up code for E2E functional / integration tests.
 */

import { INestApplication } from '@nestjs/common';
import { getApolloServer, GqlModuleOptions } from '@nestjs/graphql';
import { GRAPHQL_MODULE_OPTIONS } from '@nestjs/graphql/dist/graphql.constants';
import { Test, TestingModule } from '@nestjs/testing';
import {
  ApolloServerTestClient,
  createTestClient,
} from 'apollo-server-testing';
import { applyMiddleware } from 'graphql-middleware';
import { AppModule } from '../../src/app.module';
import { throwNestedErrorPlugin } from '../../src/get-nested-error';
import { appPermissions } from '../../src/rules';
import {
  configurePollyRequestMatching,
  persistRedactedAPICalls,
  persistRedactedAuth0AccessTokenUpdates,
} from './polly.helpers';

/** Dynamic context to run tests with. */
export type SharedTestContext = {
  app: INestApplication;

  /** @see https://www.apollographql.com/docs/apollo-server/testing/testing/ */
  client: ApolloServerTestClient;
};

/**
 * Perform shared setup, and return a context object.
 *
 * This should be called at the top level of a `describe` block:
 *
 * ```
 * const ctx: SharedTestContext = sharedTestSetup();
 * ```
 *
 * This will set up {@link AppModule}, along with Polly.
 */
export function sharedTestSetup(): SharedTestContext {
  const ctx: SharedTestContext = {
    app: (null as unknown) as INestApplication,
    client: (null as unknown) as ApolloServerTestClient,
  };

  beforeAll(async () => {
    const gqlModuleOptions: GqlModuleOptions = {
      autoSchemaFile: true, // Keep in-memory
      introspection: true,
      plugins: [throwNestedErrorPlugin],
      // XXX: Skip client auth, for now.
      transformSchema: schema => applyMiddleware(schema, appPermissions),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(GRAPHQL_MODULE_OPTIONS)
      .useValue(gqlModuleOptions)
      .compile();

    ctx.app = moduleFixture.createNestApplication();
    await ctx.app.init();

    ctx.client = createTestClient(getApolloServer(ctx.app));
  });

  afterAll(async () => {
    await ctx.app.close();
  });

  beforeEach(() => {
    configurePollyRequestMatching(ctx.app);
    persistRedactedAuth0AccessTokenUpdates(ctx.app);
    persistRedactedAPICalls(ctx.app);
  });

  return ctx;
}
