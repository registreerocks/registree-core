import fc from 'fast-check';
import { validateToErrorMessage } from '../../common/test.helpers';
import { ExpandEventQueryInput } from './expand-event-query.input';
import {
  arbitraryExpandEventQueryInput,
  arbitraryInvalidExpandEventQueryInput,
} from './expand-event-query.input.arb';

describe('ExpandEventQueryInput', () => {
  test('empty input fails', async () => {
    expect(await validateToErrorMessage(new ExpandEventQueryInput()))
      .toMatchInlineSnapshot(`
      "An instance of ExpandEventQueryInput has failed the validation:
       - property degrees has failed the following constraints: isArray 
      An instance of ExpandEventQueryInput has failed the validation:
       - property academicYearOfStudyList has failed the following constraints: arrayUnique, isEnum 
      "
    `);
  });

  test('arbitrary valid input', async () => {
    await fc.assert(
      fc.asyncProperty(arbitraryExpandEventQueryInput(), async input => {
        expect(await validateToErrorMessage(input)).toBe('');
      }),
    );
  });

  test('arbitrary invalid input', async () => {
    await fc.assert(
      fc.asyncProperty(arbitraryInvalidExpandEventQueryInput(), async input => {
        expect(await validateToErrorMessage(input)).not.toBe('');
      }),
    );
  });
});
