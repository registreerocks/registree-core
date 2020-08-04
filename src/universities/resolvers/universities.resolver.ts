import { Resolver, Query, ResolveField, Parent } from '@nestjs/graphql';
import { University, BaseUniversity } from '../models/university.model';
import { UniversitiesService } from '../universities.service';
import { Faculty, BaseFaculty } from '../models/faculty.model';

@Resolver(_of => University)
export class UniversitiesResolver {
  constructor(private readonly universitiesService: UniversitiesService) {}

  @Query(_returns => [University])
  async getUniversities(): Promise<BaseUniversity[]> {
    return this.universitiesService.getUniversities();
  }

  @ResolveField('faculties', _returns => [Faculty])
  getUniversityFaculties(
    @Parent() university: University,
  ): Promise<BaseFaculty[]> {
    return this.universitiesService.getUniversityFaculties(university.id);
  }
}
