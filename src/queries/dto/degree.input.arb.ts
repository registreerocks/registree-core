import fc from 'fast-check';
import { DegreeInput } from './degree.input';

export function arbitraryDegreeInput(): fc.Arbitrary<DegreeInput> {
  const validAbsolute = fc.integer({ min: 1 });
  const validPercentage = fc.integer({ min: 1, max: 100 });

  return fc
    .oneof(
      fc.record({ degreeId: fc.string(), absolute: validAbsolute }),
      fc.record({ degreeId: fc.string(), percentage: validPercentage }),
    )
    .map(
      (record: { degreeId: string; absolute?: number; percentage?: number }) =>
        Object.assign(new DegreeInput(), record),
    );
}

export function arbitraryInvalidDegreeInput(): fc.Arbitrary<DegreeInput> {
  const decoys = fc.oneof(
    fc.constant(undefined),
    fc.constant(null),
    fc.boolean(),
    fc.double(),
    fc.date(),
  );
  const notString = fc.oneof(fc.integer(), decoys);
  const notInteger = fc.oneof(fc.string(), decoys);

  const invalidRecords = fc
    .record(
      {
        degreeId: notString,
        absolute: fc.oneof(fc.integer({ max: 0 }), notInteger),
        percentage: fc.oneof(
          fc.integer({ max: 0 }),
          fc.integer({ min: 101 }),
          notInteger,
        ),
      },
      { requiredKeys: [] },
    )
    .filter(o => 0 < Object.keys(o).length);

  return (
    arbitraryDegreeInput()
      .chain(valid =>
        invalidRecords.map(invalid => Object.assign(valid, invalid)),
      )
      // TODO: Mutual exclusion not implemented: skip when both present, for now.
      // (Remove this once implemented.)
      .filter((o: DegreeInput) => !('percentage' in o && 'absolute' in o))
  );
}
