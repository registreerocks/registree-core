import { Injectable, Scope } from '@nestjs/common';
import { OrderedNestDataLoader } from 'nestjs-graphql-dataloader';
import { Degree } from '../models/degree.model';
import { UniversitiesService } from '../universities.service';

@Injectable({ scope: Scope.REQUEST })
export class FacultyDegreesLoader extends OrderedNestDataLoader<
  string,
  { id: string; degrees: Degree[] }
> {
  constructor(private readonly universitiesService: UniversitiesService) {
    super();
  }

  protected getOptions = () => ({
    query: (keys: readonly string[]) =>
      Promise.all(keys.map(x => this.universitiesService.getFacultyDegrees(x))),
    typeName: 'Degrees',
  });
}
