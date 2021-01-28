import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { UniversitiesService } from '../universities.service';
import { Faculty } from '../models/faculty.model';
import { Degree } from '../models/degree.model';
import { GroupedDegrees } from '../models/grouped-degrees.model';
import _ from 'lodash';
import { University } from '../models/university.model';
import { UniversitiesLoader } from '../loaders/universities.loader';
import DataLoader from 'dataloader';
import { Loader } from 'nestjs-graphql-dataloader';
import { FacultyDegreesLoader } from '../loaders/faculty-degrees.loader';

@Resolver(_of => Faculty)
export class FacultiesResolver {
  constructor(private readonly universitiesService: UniversitiesService) {}

  @ResolveField('degrees', _returns => [Degree])
  async getDegrees(
    @Parent() faculty: Faculty,
    @Loader(FacultyDegreesLoader)
    loader: DataLoader<string, { id: string; degrees: Degree[] }>,
  ): Promise<Degree[]> {
    return loader.load(faculty.id).then(x => x.degrees);
  }

  @ResolveField('groupedDegrees', _returns => [GroupedDegrees])
  async getGroupedDegrees(
    @Parent() faculty: Faculty,
    @Loader(FacultyDegreesLoader)
    loader: DataLoader<string, { id: string; degrees: Degree[] }>,
  ): Promise<{ name: string; degrees: Degree[] }[]> {
    const res = await loader.load(faculty.id).then(x => x.degrees);
    return _.chain(res)
      .groupBy(x => x.name)
      .map((value, key) => ({ name: key, degrees: value }))
      .value();
  }

  @ResolveField('university', _returns => University)
  async getUniversity(
    @Parent() faculty: Faculty,
    @Loader(UniversitiesLoader) loader: DataLoader<string, University>,
  ): Promise<University> {
    if (faculty.university instanceof University) {
      return faculty.university;
    } else {
      return loader.load(faculty.university.toHexString());
    }
  }
}
