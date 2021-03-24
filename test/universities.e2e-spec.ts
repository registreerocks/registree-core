/**
 * E2E tests for {@link UniversitiesResolver}
 */

import { gql } from 'apollo-server-core';
import { ExecutionResult } from 'graphql';
import { Faculty } from '../src/universities/models/faculty.model';
import { University } from '../src/universities/models/university.model';
import { Fixture } from './data-fixtures/fixture.helpers';
import {
  SharedTestContext,
  sharedTestSetup,
} from './helpers/shared-test-setup';

describe('UniversitiesResolver (E2E)', () => {
  const ctx: SharedTestContext = sharedTestSetup();

  const fixture = new Fixture(['degrees']);

  beforeAll(async () => {
    await fixture.install(ctx.app);
  });

  afterAll(async () => {
    await fixture.remove(ctx.app);
  });

  test('getUniversities', async () => {
    // Same query as client:
    const query = gql`
      query {
        universities: getUniversities {
          id
          name
          country
          faculties {
            id
            name
            groupedDegrees {
              name
              degrees {
                id
                name
                description
                level
              }
            }
          }
        }
      }
    `;

    const result: ExecutionResult<
      { universities: University[] },
      never
    > = await ctx.client.query({ query });

    expect(result.errors).toStrictEqual(undefined);
    expect(result.data).toMatchSnapshot();
  });

  describe('getFaculty', () => {
    const query = gql`
      query GetFaculty($facultyId: ID!) {
        faculty: getFaculty(facultyId: $facultyId) {
          id
          name
          description
        }
      }
    `;
    // Type aliases for readability
    type TData = { faculty: Faculty };
    type TVars = { facultyId: string };
    type TResult = ExecutionResult<TData, never>;

    test('found', async () => {
      const result: TResult = await ctx.client.query<TData, TVars>({
        query,
        variables: { facultyId: '5ef1144a1c7d4d99fe6d9813' },
      });

      expect(result.errors).toStrictEqual(undefined);
      expect(result.data).toMatchInlineSnapshot(`
        Object {
          "faculty": Object {
            "description": "Commerce degree programmes prepare students for the personnel needs of the fast-growing world of financial service industries and prepare them for participation in the global economy.",
            "id": "5ef1144a1c7d4d99fe6d9813",
            "name": "Faculty of Commerce",
          },
        }
      `);
    });

    test('not found', async () => {
      const result: TResult = await ctx.client.query<TData, TVars>({
        query,
        variables: { facultyId: '000000000000000000000000' },
      });

      expect(result.errors).toMatchInlineSnapshot(`
        Array [
          [GraphQLError: Internal Server Error],
        ]
      `);
      expect(result.data).toMatchInlineSnapshot(`null`);
    });
  });
});
