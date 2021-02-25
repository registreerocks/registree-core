import { gql } from 'apollo-server-core';
import { ExecutionResult } from 'graphql';
import { Quote } from '../src/pricing/models/quote.model';
import { CreateEventQueryInput } from '../src/queries/dto/create-event-query.input';
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
});
