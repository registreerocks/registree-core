import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { Degree } from '../models/degree.model';
import { Faculty } from '../models/faculty.model';
import { FacultiesLoader } from '../loaders/faculties.loader';
import DataLoader from 'dataloader';
import { Loader } from 'nestjs-graphql-dataloader';
import { Types } from 'mongoose';

@Resolver(_of => Degree)
export class DegreesResolver {
  @ResolveField('faculty', _returns => Faculty)
  async getFaculty(
    @Parent() degree: Degree,
    @Loader(FacultiesLoader) loader: DataLoader<string, Faculty>,
  ): Promise<Faculty> {
    return loader.load((degree.faculty as Types.ObjectId).toHexString());
  }
}
