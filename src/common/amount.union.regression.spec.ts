/**
 * Regression test for a bug in @nestjs/graphql's union type resolving.
 *
 * The bug gets triggered after applying a schema transform (and potentially anything
 * else that results in more than one instance of the union type objects existing).
 *
 * The type resolving code in @nestjs/graphql fails to normalise these to the same
 * type instances, which causes inline type condition fragments on the union types
 * to mismatch, and fail to return their member fields.
 *
 * The workaround for now is to return a string reference instead of a type instance in
 * {@link AmountUnion#resolveType}.
 *
 * @see https://github.com/graphql/graphql-js/issues/1093 graphql-js #1093 (extendSchema breaks resolution of fragments on interfaces / unions)
 * @see https://github.com/MichalLytek/type-graphql/issues/583 type-graphql #583 (Union type doesn't work when running two schemas together)
 * @see https://github.com/MichalLytek/type-graphql/issues/605 type-graphql #605 (Reference mismatch for resolveType with classes)
 *
 * @see https://github.com/registreerocks/registree-core/issues/367 registree-core 367 (Check GraphQL return result on the percentage/absolute discriminated union)
 */

import {
  getApolloServer,
  GqlModuleOptions,
  GraphQLModule,
} from '@nestjs/graphql';
import { Test, TestingModule } from '@nestjs/testing';
import { gql } from 'apollo-server-core';
import {
  ApolloServerTestClient,
  createTestClient,
} from 'apollo-server-testing';
import { applyMiddleware } from 'graphql-middleware';
import { shield } from 'graphql-shield';
import { CustomersService } from '../customers/customers.service';
import { PricingService } from '../pricing/pricing.service';
import { EventQuery } from '../queries/models/event-query.model';
import { QueriesService } from '../queries/queries.service';
import { EventQueriesResolver } from '../queries/resolvers/event-queries.resolver';

/**
 * Test helper:
 * Set up a test scenario with the given {@link GraphQLModule} options and run `body`.
 *
 * This provides a mock {@link QueriesService#getQuery} result.
 */
async function withScenario(
  gqlModuleOptions: GqlModuleOptions,
  body: (client: ApolloServerTestClient) => Promise<void>,
): Promise<void> {
  const mockResult: Pick<EventQuery, 'queryDetails'> = {
    queryDetails: {
      parameters: [
        {
          degreeId: 'p',
          amount: { amountType: 'Percentage', percentage: 50 },
        },
        {
          degreeId: 'a',
          amount: { amountType: 'Absolute', absolute: 10 },
        },
        {
          degreeId: 'avg',
          amount: { amountType: 'Average', average: 10 },
        },
      ],
      academicYearOfStudyList: [],
      rawResults: [],
      updatedAt: new Date(),
      race: [],
      gender: [],
    },
  };
  const mockQueriesService: Partial<QueriesService> = {
    getQuery: jest.fn().mockResolvedValue(mockResult),
  };

  const module: TestingModule = await Test.createTestingModule({
    imports: [GraphQLModule.forRoot(gqlModuleOptions)],
    providers: [
      { provide: QueriesService, useValue: mockQueriesService },
      { provide: PricingService, useValue: null },
      { provide: CustomersService, useValue: null },
      EventQueriesResolver,
    ],
  }).compile();

  const app = module.createNestApplication();
  await app.init();
  const client = createTestClient(getApolloServer(app));

  try {
    await body(client);
  } finally {
    await app.close();
  }
}

/**
 * Test helper:
 * Run the test query with the given client.
 *
 * The intent is to confirm that the `absolute` and `percentage` fields are present.
 */
async function runTest(client: ApolloServerTestClient) {
  const query = gql`
    query getQuery($id: ID!) {
      queryResult: getQuery(id: $id) {
        queryDetails {
          parameters {
            amount {
              __typename
              ... on Absolute {
                absolute
              }
              ... on Percentage {
                percentage
              }
              ... on Average {
                average
              }
            }
          }
        }
      }
    }
  `;
  const result = await client.query({
    query,
    variables: { id: 'dummy-id' },
  });

  expect(result.data).toEqual({
    queryResult: {
      queryDetails: {
        parameters: [
          {
            amount: {
              __typename: 'Percentage',
              percentage: 50,
            },
          },
          {
            amount: {
              __typename: 'Absolute',
              absolute: 10,
            },
          },
          {
            amount: {
              __typename: 'Average',
              average: 10,
            },
          },
        ],
      },
    },
  });
}

describe('regression test for @nestjs/graphql union type resolving bug', () => {
  const baseOptions: GqlModuleOptions = { autoSchemaFile: true };

  /** Base case: this should always work. */
  test('without schema transform', async () => {
    await withScenario(baseOptions, async client => {
      await runTest(client);
    });
  });

  /** Regression case: this fails without the workaround. */
  test('with schema transform', async () => {
    const optionsWithMiddleware: GqlModuleOptions = {
      ...baseOptions,
      transformSchema: schema => applyMiddleware(schema, shield({})),
    };
    await withScenario(optionsWithMiddleware, async client => {
      await runTest(client);
    });
  });
});
