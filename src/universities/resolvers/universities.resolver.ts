import { Resolver, Query, ResolveField, Parent } from '@nestjs/graphql';
import { University } from '../models/university.model';
import { UniversitiesService } from '../universities.service';
import { Faculty } from '../models/faculty.model';

@Resolver(_of => University)
export class UniversitiesResolver {
  constructor(private readonly universitiesService: UniversitiesService) {}

  @Query(_returns => [University])
  async getUniversities(): Promise<University[]> {
    return this.universitiesService.getUniversities();
  }

  @ResolveField('faculties', _returns => [Faculty])
  async getUniversityFaculties(
    @Parent() university: University,
  ): Promise<Faculty[]> {
    return this.universitiesService.getUniversityFaculties(university.id);
  }
}
