import { gql } from 'apollo-server-core';
import { IsAlpha, IsInt, IsOptional } from 'class-validator';
import * as fc from 'fast-check';
import * as graphql from 'graphql';
import {
  coerceNullPrototypeObjects,
  execGraphQL,
  hasNullPrototype,
  hasObjectPrototype,
  validateToErrorMessage,
} from './test.helpers';

describe('validateToErrorMessage', () => {
  class DummyInput {
    @IsOptional() @IsAlpha() label?: string;
    @IsOptional() @IsInt() count?: number;
  }

  test('no errors', async () => {
    const input = new DummyInput();
    expect(await validateToErrorMessage(input)).toStrictEqual('');
  });

  test('some errors', async () => {
    const input: DummyInput = Object.assign(new DummyInput(), {
      label: '123',
      count: 1.5,
    });
    expect(await validateToErrorMessage(input)).toMatchInlineSnapshot(`
      "An instance of DummyInput has failed the validation:
       - property label has failed the following constraints: isAlpha 
      An instance of DummyInput has failed the validation:
       - property count has failed the following constraints: isInt 
      "
    `);
  });
});

/** For `fc.anything`: everything except null prototype objects. */
const withoutNullPrototype: fc.ObjectConstraints = {
  withBigInt: true,
  withBoxedValues: true,
  withDate: true,
  withMap: true,
  withObjectString: true,
  withNullPrototype: false,
  withSet: true,
  withTypedArray: true,
};

describe('hasNullPrototype and hasObjectPrototype', () => {
  test('Object.create(null): hasNullPrototype, not hasObjectPrototype', () => {
    const o = Object.create(null) as { unknown: unknown };
    expect(hasNullPrototype(o)).toBe(true);
    expect(hasObjectPrototype(o)).toBe(false);
  });

  test('plain objects: hasObjectPrototype, not hasNullPrototype', () => {
    fc.assert(
      fc.property(
        fc.object({ ...withoutNullPrototype, withNullPrototype: true }),
        o => {
          expect(hasObjectPrototype(o)).toBe(true);
          expect(hasNullPrototype(o)).toBe(false);
        },
      ),
    );
  });

  test('everything else: not hasNullPrototype', () => {
    fc.assert(
      fc.property(fc.anything(withoutNullPrototype), o => {
        expect(hasNullPrototype(o)).toBe(false);
      }),
    );
  });
});

describe('coerceNullPrototypeObjects', () => {
  test('everything excluding null prototype objects', () => {
    fc.assert(
      fc.property(fc.anything(withoutNullPrototype), (input: unknown) => {
        const result = coerceNullPrototypeObjects(input);
        expect(result).toStrictEqual(input);
      }),
    );
  });

  test('everything including null prototype objects', () => {
    // Helper: True if any objects or arrays in o contain a null prototype object.
    const containsNullPrototype = (o: unknown) =>
      hasNullPrototype(o) ||
      (hasObjectPrototype(o) && Object.values(o).some(containsNullPrototype)) ||
      (o instanceof Array && o.some(containsNullPrototype));

    // Filter fc.anything() down to values that actually contain a null prototype object somewhere.
    const anythingContainingNullPrototypes = fc
      .anything({
        ...withoutNullPrototype,
        withNullPrototype: true,
      })
      .filter(containsNullPrototype);

    fc.assert(
      fc.property(anythingContainingNullPrototypes, input => {
        const output = coerceNullPrototypeObjects(input);
        // The input contains null prototypes, but the output should not.
        expect(containsNullPrototype(input)).toBe(true);
        expect(containsNullPrototype(output)).toBe(false);
        // The difference between input and output should fail toStrictEqual,
        // but still pass toEqual.
        expect(output).not.toStrictEqual(input);
        expect(output).toEqual(input);
      }),
    );
  });
});

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

  test('string query source also works', async () => {
    const query = `
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

  test('dummy value with variable', async () => {
    const query = gql`
      query dummyQuery($dummyVar: Boolean!) {
        dummyValue @include(if: $dummyVar)
      }
    `;
    expect(
      await execGraphQL(schema, query, {
        variableValues: { dummyVar: true },
      }),
    ).toMatchInlineSnapshot(`
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
      `"execGraphQL: DocumentNode query has no loc"`,
    );
  });
});
