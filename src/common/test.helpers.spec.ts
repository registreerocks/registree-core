import { gql } from 'apollo-server-core';
import * as graphql from 'graphql';
import { execGraphQL } from './test.helpers';

describe('execGraphQL', () => {
  let schema: graphql.GraphQLSchema;

  beforeAll(() => {
    schema = new graphql.GraphQLSchema({
      query: new graphql.GraphQLObjectType({
        name: 'Query',
        fields: {
          dummyValue: {
            type: graphql.GraphQLString,
            resolve: () => 'dummy value',
          },
          dummyError: {
            type: graphql.GraphQLString,
            resolve: () => {
              throw new Error('Dummy error');
            },
          },
        },
      }),
    });
  });

  test('dummy value', async () => {
    const query = gql`
      {
        dummyValue
      }
    `;
    expect(await execGraphQL(schema, query)).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "dummyValue": "dummy value",
        },
      }
    `);
  });

  test('dummy error', async () => {
    const query = gql`
      {
        dummyError
      }
    `;
    await expect(
      execGraphQL(schema, query),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`"Dummy error"`);
  });

  test('multiple errors', async () => {
    const query = gql`
      {
        ham
        spam
      }
    `;
    await expect(execGraphQL(schema, query)).rejects
      .toThrowErrorMatchingInlineSnapshot(`
            "execGraphQL: Multiple errors:

            Cannot query field \\"ham\\" on type \\"Query\\".

            GraphQL request:3:9
            2 |       {
            3 |         ham
              |         ^
            4 |         spam

            Cannot query field \\"spam\\" on type \\"Query\\".

            GraphQL request:4:9
            3 |         ham
            4 |         spam
              |         ^
            5 |       }"
          `);
  });

  test('missing query source', async () => {
    const { loc: _, ...queryWithoutLoc } = gql`
      {
        dummyValue
      }
    `;
    await expect(
      execGraphQL(schema, queryWithoutLoc),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"execGraphQL: query.loc undefined"`,
    );
  });
});
