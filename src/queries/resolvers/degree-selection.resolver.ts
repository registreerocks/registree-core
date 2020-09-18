import { Resolver, Parent, ResolveField } from '@nestjs/graphql';
import { Degree } from 'src/universities/models/degree.model';
import { DegreesLoader } from 'src/universities/loaders/degrees.loader';
import DataLoader from 'dataloader';
import { Loader } from 'nestjs-graphql-dataloader';
import { DegreeSelection } from '../models/degree-selection.model';

@Resolver(_of => DegreeSelection)
export class DegreeSelectionResolver {
  @ResolveField('degree', _returns => Degree)
  async getDegree(
    @Parent() degreeSelection: DegreeSelection,
    @Loader(DegreesLoader) loader: DataLoader<string, Degree>,
  ): Promise<Degree> {
    return loader.load(degreeSelection.degreeId);
  }
}
