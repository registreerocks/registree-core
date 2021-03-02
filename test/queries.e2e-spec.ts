import { gql } from 'apollo-server-core';
import { ExecutionResult } from 'graphql';
import { DocumentDefinition } from 'mongoose';
import { assertDefined } from '../src/common/helpers';
import { Quote } from '../src/pricing/models/quote.model';
import { CreateEventQueryInput } from '../src/queries/dto/create-event-query.input';
import { ExpandEventQueryInput } from '../src/queries/dto/expand-event-query.input';
import { EventQuery } from '../src/queries/models/event-query.model';
import { Degree } from '../src/universities/models/degree.model';
import {
  TEST_CUSTOMER_CONTACT_ID,
  TEST_CUSTOMER_ID,
} from './data-fixtures/customers.fixture';
import { getDegrees } from './data-fixtures/degrees.fixture';
import { Fixture } from './data-fixtures/fixture.helpers';
import {
  SharedTestContext,
  sharedTestSetup,
} from './helpers/shared-test-setup';

describe('queries (e2e)', () => {
  const ctx: SharedTestContext = sharedTestSetup();

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

    const result: ExecutionResult<{ quote: Quote }> = await ctx.client.query({
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

  describe('createQuery and expandQuery', () => {
    jest.setTimeout(10_000); // 5s is a bit too short for these tests when recording

    async function runCreateQuery(): Promise<string> {
      const createQueryMutation = gql`
        mutation($queryInput: CreateEventQueryInput!) {
          createQuery(createEventQueryInput: $queryInput) {
            id
          }
        }
      `;
      const queryInput: CreateEventQueryInput = {
        name: 'dummy name',
        address: 'dummy address',
        startDate: new Date(2020, 2, 20, 8),
        endDate: new Date(2020, 2, 20, 16),
        information: 'dummy information',
        degrees: [],
        eventType: 'dummy eventType',
      };

      const result = await ctx.client.mutate<
        { createQuery: Pick<EventQuery, 'id'> },
        { queryInput: CreateEventQueryInput }
      >({ mutation: createQueryMutation, variables: { queryInput } });

      expect(result.errors).toStrictEqual(undefined);
      expect(result.data?.createQuery).toBeDefined();

      return assertDefined(result.data?.createQuery).id;
    }

    async function runExpandQuery(
      queryId: string,
      queryInput: ExpandEventQueryInput = { degrees: [] },
    ) {
      const expandQueryMutation = gql`
        mutation($queryInput: ExpandEventQueryInput!, $queryId: ID!) {
          expandQuery(expandEventQueryInput: $queryInput, queryId: $queryId) {
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
                }
                degree {
                  id
                  name
                  description
                }
              }
            }
          }
        }
      `;

      return await ctx.client.mutate<
        { expandQuery: Partial<EventQuery> },
        { queryInput: ExpandEventQueryInput; queryId: string }
      >({
        mutation: expandQueryMutation,
        variables: { queryInput, queryId },
      });
    }

    const fixture = new Fixture(['degrees', 'customers']);

    beforeAll(async () => {
      await fixture.install(ctx.app);
    });

    afterAll(async () => {
      await fixture.remove(ctx.app);
    });

    const recruiter = {
      userId: TEST_CUSTOMER_CONTACT_ID,
      dbId: TEST_CUSTOMER_ID,
      scope: 'recruiter',
    };

    test('no expand', async () => {
      ctx.user = recruiter;
      const queryId = await runCreateQuery();

      const query = await runExpandQuery(queryId);
      expect(query).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "expandQuery": Object {
              "queryDetails": Object {
                "parameters": Array [],
              },
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

    test('simple expand', async () => {
      ctx.user = recruiter;
      const queryId = await runCreateQuery();

      const degrees: DocumentDefinition<Degree>[] = getDegrees();

      expect(
        await runExpandQuery(queryId, {
          degrees: [
            { degreeId: degrees[0].id, absolute: 10 },
            { degreeId: degrees[1].id, percentage: 5 },
          ],
        }),
      ).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "expandQuery": Object {
              "queryDetails": Object {
                "parameters": Array [
                  Object {
                    "amount": Object {
                      "__typename": "Absolute",
                      "absolute": 10,
                    },
                    "degree": Object {
                      "description": "BBusSc in Actuarial Science",
                      "id": "5ef1144a1c7d4d99fe6d9814",
                      "name": "Actuarial Science",
                    },
                  },
                  Object {
                    "amount": Object {
                      "__typename": "Percentage",
                      "percentage": 5,
                    },
                    "degree": Object {
                      "description": "BCom Actuarial Science",
                      "id": "5ef1144a1c7d4d99fe6d9815",
                      "name": "Actuarial Science",
                    },
                  },
                ],
              },
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

    test('invalid expand', async () => {
      ctx.user = recruiter;
      const queryId = await runCreateQuery();

      const degrees: DocumentDefinition<Degree>[] = getDegrees();
      const degreeId = degrees[0].id;

      expect(
        await runExpandQuery(queryId, {
          degrees: [{ degreeId, absolute: 10 }],
        }),
      ).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "expandQuery": Object {
              "queryDetails": Object {
                "parameters": Array [
                  Object {
                    "amount": Object {
                      "__typename": "Absolute",
                      "absolute": 10,
                    },
                    "degree": Object {
                      "description": "BBusSc in Actuarial Science",
                      "id": "5ef1144a1c7d4d99fe6d9814",
                      "name": "Actuarial Science",
                    },
                  },
                ],
              },
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

      expect(
        await runExpandQuery(queryId, {
          degrees: [{ degreeId: degreeId, absolute: 5 }],
        }),
      ).toMatchInlineSnapshot(`
        Object {
          "data": null,
          "errors": Array [
            [GraphQLError: Amount is smaller than in previous selection],
          ],
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
});
