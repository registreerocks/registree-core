import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { Degree } from '../models/degree.model';
import { Faculty } from '../models/faculty.model';

@Resolver(_of => Degree)
export class DegreesResolver {
  @ResolveField('faculty', _returns => Faculty)
  async getFaculty(@Parent() degree: Degree): Promise<Faculty> {
    return (await degree.populate('faculty').execPopulate()).faculty as Faculty;
  }
}
