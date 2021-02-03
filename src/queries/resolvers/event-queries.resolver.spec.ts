import { INestApplication } from '@nestjs/common';
import { GraphQLModule, GraphQLSchemaHost } from '@nestjs/graphql';
import { Test, TestingModule } from '@nestjs/testing';
import { gql } from 'apollo-server-core';
import fc from 'fast-check';
import { GraphQLSchema, printSchema } from 'graphql';
import {
  coerceNullPrototypeObjects,
  execGraphQL,
} from '../../common/test.helpers';
import { CustomersService } from '../../customers/customers.service';
import { Quote } from '../../pricing/models/quote.model';
import { RsvpCost } from '../../pricing/models/rsvp-cost.model';
import { PricingService } from '../../pricing/pricing.service';
import { arbitraryCreateEventQueryInput } from '../dto/create-event-query.input.arb';
import { QueriesService } from '../queries.service';
import { EventQueriesResolver } from './event-queries.resolver';

describe('EventQueriesResolver', () => {
  let app: INestApplication;
  let schema: GraphQLSchema;
  const mockQueriesService: Partial<QueriesService> = {};

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [GraphQLModule.forRoot({ autoSchemaFile: true })],
      providers: [
        { provide: QueriesService, useValue: mockQueriesService },
        { provide: PricingService, useValue: null },
        { provide: CustomersService, useValue: null },
        EventQueriesResolver,
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    const schemaHost: GraphQLSchemaHost = app.get(GraphQLSchemaHost);
    schema = schemaHost.schema;
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => {
    expect(mockQueriesService).toStrictEqual({});
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

    await fc.assert(
      fc.asyncProperty(
        arbitraryCreateEventQueryInput(),
        arbitraryQuote(),
        async (input, output) => {
          try {
            mockQueriesService.getQuote = jest
              .fn()
              .mockResolvedValueOnce(output);

            const result = await execGraphQL(schema, query, {
              variableValues: { input },
            });
            expect(coerceNullPrototypeObjects(result)).toStrictEqual({
              data: { quote: output },
            });
            // Verify calls:
            expect(mockQueriesService.getQuote).toHaveBeenCalledWith(input);
            expect(mockQueriesService.getQuote).toHaveBeenCalledTimes(1);
          } finally {
            delete mockQueriesService.getQuote;
          }
        },
      ),
    );
  });

  test('schema snapshot', () => {
    expect(printSchema(schema)).toMatchSnapshot();
  });
});

function arbitraryRsvpCost(): fc.Arbitrary<RsvpCost> {
  return fc.record({
    cost: fc.double(),
    percent: fc.integer(),
  });
}

function arbitraryQuote(): fc.Arbitrary<Quote> {
  return fc.record({
    numberOfStudents: fc.integer(),
    rsvpCostBreakdown: fc.array(arbitraryRsvpCost()),
  });
}
