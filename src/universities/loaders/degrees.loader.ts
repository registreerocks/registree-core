import { Injectable, Scope } from '@nestjs/common';
import { OrderedNestDataLoader } from 'nestjs-graphql-dataloader';
import { Degree } from '../models/degree.model';
import { UniversitiesService } from '../universities.service';

@Injectable({ scope: Scope.REQUEST })
export class DegreesLoader extends OrderedNestDataLoader<string, Degree> {
  constructor(private readonly universitiesService: UniversitiesService) {
    super();
  }

  protected getOptions = () => ({
    query: (keys: readonly string[]) =>
      this.universitiesService.getDegreesById(keys),
  });
}
