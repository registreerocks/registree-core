/**
 * E2E tests for {@link UniversitiesResolver}
 */

import { gql } from 'apollo-server-core';
import { ExecutionResult } from 'graphql';
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
});
