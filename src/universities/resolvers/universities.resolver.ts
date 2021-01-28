import { Resolver, Query, ResolveField, Parent } from '@nestjs/graphql';
import { University } from '../models/university.model';
import { UniversitiesService } from '../universities.service';
import { Faculty } from '../models/faculty.model';
import DataLoader from 'dataloader';
import { Loader } from 'nestjs-graphql-dataloader';
import { FacultiesLoader } from '../loaders/faculties.loader';
import { UniversitiesLoader } from '../loaders/universities.loader';

@Resolver(_of => University)
export class UniversitiesResolver {
  constructor(private readonly universitiesService: UniversitiesService) {}

  @Query(_returns => [University])
  async getUniversities(
    @Loader(UniversitiesLoader)
    universitiesLoader: DataLoader<string, University>,
  ): Promise<University[]> {
    const res = await this.universitiesService.getUniversities();
    res.forEach(x => universitiesLoader.prime(x.id, x));
    return res;
  }

  @ResolveField('faculties', _returns => [Faculty])
  async getUniversityFaculties(
    @Parent() university: University,
    @Loader(FacultiesLoader) facultiesLoader: DataLoader<string, Faculty>,
  ): Promise<Faculty[]> {
    const res = await this.universitiesService.getUniversityFaculties(
      university.id,
    );
    res.map(x => facultiesLoader.prime(x.id, x));
    return res;
  }
}
