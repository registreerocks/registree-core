import { INestApplication } from '@nestjs/common';
import { getApolloServer, GqlModuleOptions } from '@nestjs/graphql';
import { GRAPHQL_MODULE_OPTIONS } from '@nestjs/graphql/dist/graphql.constants';
import { Test, TestingModule } from '@nestjs/testing';
import { gql } from 'apollo-server-core';
import {
  ApolloServerTestClient,
  createTestClient,
} from 'apollo-server-testing';
import { ExecutionResult } from 'graphql';
import { applyMiddleware } from 'graphql-middleware';
import { AppModule } from '../src/app.module';
import { throwNestedErrorPlugin } from '../src/get-nested-error';
import { Quote } from '../src/pricing/models/quote.model';
import { CreateEventQueryInput } from '../src/queries/dto/create-event-query.input';
import { appPermissions } from '../src/rules';
import {
  persistRedactedAuth0AccessTokenUpdates,
  persistRedactedQueryAPICalls,
} from './helpers/polly.helpers';

describe('queries (e2e)', () => {
  let app: INestApplication;
  let client: ApolloServerTestClient;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(GRAPHQL_MODULE_OPTIONS)
      .useValue({
        autoSchemaFile: true, // Keep in-memory
        introspection: true,
        plugins: [throwNestedErrorPlugin],
        // XXX: Skip client auth, for now.
        transformSchema: schema => applyMiddleware(schema, appPermissions),
      } as GqlModuleOptions)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    client = createTestClient(getApolloServer(app));
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    persistRedactedAuth0AccessTokenUpdates(app);
    persistRedactedQueryAPICalls(app);
  });

  test('getQuote', async () => {
    const query = gql`
      query getQuote($input: CreateEventQueryInput!) {
        quote: getQuote(createEventQueryInput: $input) {
          numberOfStudents
          rsvpCostBreakdown {
            cost
            percent
          }
        }
      }
    `;
    const input: CreateEventQueryInput = {
      name: 'dummy name',
      address: 'dummy address',
      startDate: new Date(2020, 2, 20, 8),
      endDate: new Date(2020, 2, 20, 16),
      information: 'dummy information',
      degrees: [],
      eventType: 'dummy eventType',
    };

    const result: ExecutionResult<{ quote: Quote }> = await client.query({
      query,
      variables: { input },
    });

    expect(result).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "quote": Object {
            "numberOfStudents": 0,
            "rsvpCostBreakdown": Array [
              Object {
                "cost": 2500,
                "percent": 5,
              },
              Object {
                "cost": 2500,
                "percent": 10,
              },
              Object {
                "cost": 2500,
                "percent": 20,
              },
              Object {
                "cost": 2500,
                "percent": 50,
              },
              Object {
                "cost": 2500,
                "percent": 100,
              },
            ],
          },
        },
        "errors": undefined,
        "extensions": undefined,
        "http": Object {
          "headers": Headers {
            Symbol(map): Object {},
          },
        },
      }
    `);
  });
});
