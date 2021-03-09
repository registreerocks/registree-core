/**
 * Shared set-up code for E2E functional / integration tests.
 */

import { INestApplication } from '@nestjs/common';
import { getApolloServer, GqlModuleOptions } from '@nestjs/graphql';
import { GRAPHQL_MODULE_OPTIONS } from '@nestjs/graphql/dist/graphql.constants';
import { MongooseModuleOptions } from '@nestjs/mongoose';
import { MONGOOSE_MODULE_OPTIONS } from '@nestjs/mongoose/dist/mongoose.constants';
import { Test, TestingModule } from '@nestjs/testing';
import {
  ApolloServerTestClient,
  createTestClient,
} from 'apollo-server-testing';
import { applyMiddleware } from 'graphql-middleware';
import mongoose, { Connection } from 'mongoose';
import { AppModule } from '../../src/app.module';
import { User } from '../../src/common/interfaces/user.interface';
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

  /**
   * (Optional) User to associate with the request.
   *
   * By default, requests will have no associated user: each test must set one,
   * if desired, and this will be reset to `null` after each test.
   */
  user: User | null;
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
 * This will set up {@link AppModule}, along with Polly,
 * and use a separate Mongo test database.
 */
export function sharedTestSetup(): SharedTestContext {
  const ctx: SharedTestContext = {
    app: (null as unknown) as INestApplication,
    client: (null as unknown) as ApolloServerTestClient,
    user: null,
  };

  beforeAll(async () => {
    /**
     * Override MongooseModule's options to use a test database (`TEST_MONGO_URI`).
     * @see AppConfigService.createMongooseOptions
     */
    const mongooseModuleOptions: MongooseModuleOptions = {
      uri: await getTestMongoURI(),
      sslValidate: false,
      useFindAndModify: false,
    };

    /**
     * Override GraphQLModule's options with a simpler configuration.
     * @see AppModule
     */
    const gqlModuleOptions: GqlModuleOptions = {
      // Add requesting user to the context, if set.
      context: () => (ctx.user !== null ? { req: { user: ctx.user } } : {}),
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
      .overrideProvider(MONGOOSE_MODULE_OPTIONS)
      .useValue(mongooseModuleOptions)
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

  afterEach(() => {
    ctx.user = null;
  });

  return ctx;
}

/**
 * Get the Mongo test database from `TEST_MONGO_URI`, or bail out with an error message.
 *
 * The URI must contain the placeholder string `WORKER`, which will be replaced with
 * a per-worker ID to isolate test workers from each other.
 *
 * This should **not** proceed or default to `MONGO_URI` if the `TEST_MONGO_URI`
 * variable is not set, to avoid running the E2E tests against non-test databases.
 */
async function getTestMongoURI(): Promise<string> {
  const testMongoUri: string | undefined = process.env.TEST_MONGO_URI;
  if (testMongoUri) {
    if (!testMongoUri.includes('WORKER')) {
      throw new Error(
        'shared-test-setup: TEST_MONGO_URI must include the placeholder string "WORKER"',
      );
    }
    const jestWorkerID: string = process.env.JEST_WORKER_ID ?? 'default';
    const uri = testMongoUri.replace('WORKER', `worker-${jestWorkerID}`);

    // Test the connection before returning the URI.
    // This tries to make the test suite fail early with a useful error message if
    // something's misconfigured, rather than just timing out with no details.
    try {
      const connection: Connection = await mongoose.createConnection(uri, {
        connectTimeoutMS: 1000,
      });
      await connection.close();
    } catch (err) {
      const details: string =
        err instanceof Error
          ? err.toString()
          : Object.prototype.toString.apply(err);
      throw new Error(
        [
          `shared-test-setup: failed to connect to test database: ${uri} (Is it running?)`,
          'Caused by:',
          details,
        ].join('\n\n'),
      );
    }

    return uri;
  } else {
    throw new Error(
      'shared-test-setup: Set TEST_MONGO_URI in environment before running E2E tests',
    );
  }
}
