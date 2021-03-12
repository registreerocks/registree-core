import { Query, Resolver } from '@nestjs/graphql';
import {
  AcademicYearOfStudyLabel,
  AcademicYearOfStudyLabels,
} from '../models/academic-year-of-study.model';

@Resolver()
export class AcademicYearOfStudyResolver {
  @Query(_returns => [AcademicYearOfStudyLabel], {
    description: 'Get academic years of study to display.',
  })
  getAcademicYearOfStudyLabels(): AcademicYearOfStudyLabel[] {
    return Array.from(
      AcademicYearOfStudyLabels,
      ([academicYearOfStudy, label]): AcademicYearOfStudyLabel => ({
        academicYearOfStudy,
        label,
      }),
    );
  }
}
