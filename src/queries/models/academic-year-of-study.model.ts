import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

// XXX: Use values matching keys, to make these usable as GraphQL input variable values
// without having to map them back to key names.
/** Search criteria: The academic year of study a student is in. */
export enum AcademicYearOfStudy {
  YEAR_1 = 'YEAR_1',
  YEAR_2 = 'YEAR_2',
  YEAR_3_PLUS = 'YEAR_3_PLUS',
}

registerEnumType(AcademicYearOfStudy, {
  name: 'AcademicYearOfStudy',
  description: 'The academic year of study a student is in.',
});

/** User-facing labels for each academic year of study. */
@ObjectType({
  description: 'A labelled academic year of study.',
})
export class AcademicYearOfStudyLabel {
  @Field(_type => AcademicYearOfStudy)
  readonly academicYearOfStudy!: AcademicYearOfStudy;

  @Field({ description: 'User-facing label for this year.' })
  readonly label!: string;
}

/** User-facing labels for each academic year of study. */
export const AcademicYearOfStudyLabels = new Map<AcademicYearOfStudy, string>([
  [AcademicYearOfStudy.YEAR_1, '1st year'],
  [AcademicYearOfStudy.YEAR_2, '2nd year'],
  [AcademicYearOfStudy.YEAR_3_PLUS, '3rd year +'],
]);
