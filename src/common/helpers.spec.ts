import { assertDefined } from './helpers';
import fc from 'fast-check';

describe('assertDefined', () => {
  test('reject undefined', () => {
    expect(() => assertDefined(undefined)).toThrowError(
      'assertDefined: undefined',
    );
  });

  test('reject undefined with message', () => {
    fc.assert(
      fc.property(fc.unicodeString(), message => {
        expect(() => assertDefined(undefined, message)).toThrowError(message);
      }),
    );
  });

  test('accept defined', () => {
    const anythingDefined: fc.Arbitrary<unknown> = fc
      .anything({
        withBoxedValues: true,
        withNullPrototype: true,
        withBigInt: true,
        withDate: true,
      })
      .filter(x => x !== undefined);
    fc.assert(
      fc.property(anythingDefined, fc.unicodeString(), (x, message) => {
        expect(assertDefined(x)).toStrictEqual(x);
        // Check with message given, too:
        expect(assertDefined(x, message)).toStrictEqual(x);
      }),
    );
  });
});
