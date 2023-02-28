import fc from 'fast-check';
import {
  AcademicYearOfStudy,
  AcademicYearOfStudyLabels,
} from '../models/academic-year-of-study.model';
import { CreateEventQueryInput } from './create-event-query.input';
import {
  arbitraryDegreeInput,
  arbitraryInvalidDegreeInput,
} from './degree.input.arb';

export function arbitraryCreateEventQueryInput(): fc.Arbitrary<
  CreateEventQueryInput
> {
  return fc
    .record(
      {
        name: fc.string({ minLength: 1 }),
        address: fc.string({ minLength: 1 }),
        startDate: fc.date(),
        endDate: fc.date(),
        information: fc.string({ minLength: 1 }),
        message: fc.string(),
        degrees: fc.array(arbitraryDegreeInput()),
        academicYearOfStudyList: fc.shuffledSubarray(academicYearOfStudyValues),
        eventType: fc.string({ minLength: 1 }),
        eventPlatform: fc.string({ minLength: 1 }),
        // TODO: attachments?
        password: fc.string(),
      },
      {
        requiredKeys: [
          'name',
          'address',
          'startDate',
          'endDate',
          'information',
          'degrees',
          'academicYearOfStudyList',
          'eventType',
          'eventPlatform',
        ],
      },
    )
    .map(record => Object.assign(new CreateEventQueryInput(), record));
}

export function arbitraryInvalidCreateEventQueryInput(): fc.Arbitrary<
  CreateEventQueryInput
> {
  const nullish = fc.oneof(fc.constant(undefined), fc.constant(null));
  const decoys = fc.oneof(fc.boolean(), fc.integer(), fc.double());
  const notDate = fc.oneof(nullish, fc.string(), decoys);
  const notFullString = fc.oneof(nullish, fc.constant(''), decoys);
  const notOptionalString = decoys;
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
    name: notFullString,
    address: notFullString,
    startDate: notDate,
    endDate: notDate,
    information: notFullString,
    message: notOptionalString,
    degrees: notDegrees,
    academicYearOfStudyList: notAcademicYearOfStudyList,
    eventType: notFullString,
    eventPlatform: notFullString,
    // TODO: attachments?
    password: notOptionalString,
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

  return arbitraryCreateEventQueryInput().chain(valid =>
    invalidRecords.map(invalid => Object.assign(valid, invalid)),
  );
}

const academicYearOfStudyValues = Array.from(AcademicYearOfStudyLabels.keys());
