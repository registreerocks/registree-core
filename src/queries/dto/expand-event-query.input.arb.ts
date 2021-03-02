import fc from 'fast-check';
import {
  AcademicYearOfStudy,
  AcademicYearOfStudyLabels,
} from '../models/academic-year-of-study.model';
import {
  arbitraryDegreeInput,
  arbitraryInvalidDegreeInput,
} from './degree.input.arb';
import { ExpandEventQueryInput } from './expand-event-query.input';

export function arbitraryExpandEventQueryInput(): fc.Arbitrary<
  ExpandEventQueryInput
> {
  return fc
    .record(
      {
        degrees: fc.array(arbitraryDegreeInput()),
        academicYearOfStudyList: fc.shuffledSubarray(academicYearOfStudyValues),
      },
      {
        requiredKeys: ['degrees', 'academicYearOfStudyList'],
      },
    )
    .map(record => Object.assign(new ExpandEventQueryInput(), record));
}

export function arbitraryInvalidExpandEventQueryInput(): fc.Arbitrary<
  ExpandEventQueryInput
> {
  const nullish = fc.oneof(fc.constant(undefined), fc.constant(null));
  const decoys = fc.oneof(fc.boolean(), fc.integer(), fc.double());
  const notDegrees = fc.oneof(
    nullish,
    fc.array(arbitraryInvalidDegreeInput(), { minLength: 1 }),
    decoys,
  );
  const notAcademicYearOfStudyList = fc.oneof(
    fc.array(fc.constantFrom(...academicYearOfStudyValues), {
      minLength: academicYearOfStudyValues.length + 1, // Ensure at least one duplicate.
    }),
    fc
      .anything()
      .filter(
        o => !(Array.isArray(o) && o.every(v => v in AcademicYearOfStudy)),
      ),
  );

  const invalidFields = {
    degrees: notDegrees,
    academicYearOfStudyList: notAcademicYearOfStudyList,
  };
  // First, try individual invalid fields, then combinations of them.
  const invalidRecords = fc.oneof(
    fc.oneof(
      ...Object.entries(invalidFields).map(([k, v]) => fc.record({ [k]: v })),
    ),
    fc
      .record(invalidFields, { requiredKeys: [] })
      .filter(o => 0 < Object.keys(o).length),
  );

  return arbitraryExpandEventQueryInput().chain(valid =>
    invalidRecords.map(invalid => Object.assign(valid, invalid)),
  );
}

const academicYearOfStudyValues = Array.from(AcademicYearOfStudyLabels.keys());
