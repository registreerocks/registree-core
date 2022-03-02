import fc from 'fast-check';
import { validateToErrorMessage } from '../../common/test.helpers';
import { CreateEventQueryInput } from './create-event-query.input';
import {
  arbitraryCreateEventQueryInput,
  arbitraryInvalidCreateEventQueryInput,
} from './create-event-query.input.arb';

describe('CreateEventQueryInput', () => {
  test('empty input fails', async () => {
    expect(await validateToErrorMessage(new CreateEventQueryInput()))
      .toMatchInlineSnapshot(`
      "An instance of CreateEventQueryInput has failed the validation:
       - property name has failed the following constraints: minLength 
      An instance of CreateEventQueryInput has failed the validation:
       - property address has failed the following constraints: minLength 
      An instance of CreateEventQueryInput has failed the validation:
       - property startDate has failed the following constraints: isDate 
      An instance of CreateEventQueryInput has failed the validation:
       - property endDate has failed the following constraints: isDate 
      An instance of CreateEventQueryInput has failed the validation:
       - property information has failed the following constraints: minLength 
      An instance of CreateEventQueryInput has failed the validation:
       - property degrees has failed the following constraints: isArray 
      An instance of CreateEventQueryInput has failed the validation:
       - property academicYearOfStudyList has failed the following constraints: arrayUnique, isEnum 
      An instance of CreateEventQueryInput has failed the validation:
       - property eventType has failed the following constraints: minLength 
      An instance of CreateEventQueryInput has failed the validation:
       - property eventPlatform has failed the following constraints: minLength 
      "
    `);
  });

  test('arbitrary valid input', async () => {
    await fc.assert(
      fc.asyncProperty(arbitraryCreateEventQueryInput(), async input => {
        expect(await validateToErrorMessage(input)).toBe('');
      }),
    );
  });

  test('arbitrary invalid input', async () => {
    await fc.assert(
      fc.asyncProperty(arbitraryInvalidCreateEventQueryInput(), async input => {
        expect(await validateToErrorMessage(input)).not.toBe('');
      }),
    );
  });
});
