import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { UniversitiesService } from '../universities.service';
import { Faculty } from '../models/faculty.model';
import { Degree, BaseDegree } from '../models/degree.model';
import { GroupedDegrees } from '../models/grouped-degrees.model';
import _ from 'lodash';
import { University, BaseUniversity } from '../models/university.model';

@Resolver(_of => Faculty)
export class FacultiesResolver {
  constructor(private readonly universitiesService: UniversitiesService) {}

  @ResolveField('degrees', _returns => [Degree])
  async getDegrees(@Parent() faculty: Faculty): Promise<BaseDegree[]> {
    return this.universitiesService.getFacultyDegrees(faculty.id);
  }

  @ResolveField('groupedDegrees', _returns => [GroupedDegrees])
  async getGroupedDegrees(
    @Parent() faculty: Faculty,
  ): Promise<{ name: string; degrees: BaseDegree[] }[]> {
    const res = await this.universitiesService.getFacultyDegrees(faculty.id);
    return _.chain(res)
      .groupBy(x => x.name)
      .map((value, key) => ({ name: key, degrees: value }))
      .value();
  }

  @ResolveField('university', _returns => University)
  async getUniversity(@Parent() faculty: Faculty): Promise<BaseUniversity> {
    const res = await this.universitiesService.getUniversity(
      faculty.universityId,
    );
    if (res) {
      return res;
    } else {
      throw new Error('University for faculty not found');
    }
  }
}
