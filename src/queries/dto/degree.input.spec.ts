import fc from 'fast-check';
import { validateToErrorMessage } from '../../common/test.helpers';
import { DegreeInput } from './degree.input';
import {
  arbitraryDegreeInput,
  arbitraryInvalidDegreeInput,
} from './degree.input.arb';

describe('DegreeInput', () => {
  test('empty input fails', async () => {
    expect(await validateToErrorMessage(new DegreeInput()))
      .toMatchInlineSnapshot(`
      "An instance of DegreeInput has failed the validation:
       - property degreeId has failed the following constraints: isString 
      An instance of DegreeInput has failed the validation:
       - property absolute has failed the following constraints: isDefined, min 
      "
    `);
  });

  test('arbitrary valid input', async () => {
    await fc.assert(
      fc.asyncProperty(arbitraryDegreeInput(), async input => {
        expect(await validateToErrorMessage(input)).toBe('');
      }),
    );
  });

  test('arbitrary invalid input', async () => {
    await fc.assert(
      fc.asyncProperty(arbitraryInvalidDegreeInput(), async input => {
        expect(await validateToErrorMessage(input)).not.toBe('');
      }),
    );
  });
});
