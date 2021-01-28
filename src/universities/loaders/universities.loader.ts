import { Injectable, Scope } from '@nestjs/common';
import { OrderedNestDataLoader } from 'nestjs-graphql-dataloader';
import { UniversitiesService } from '../universities.service';
import { University } from '../models/university.model';

@Injectable({ scope: Scope.REQUEST })
export class UniversitiesLoader extends OrderedNestDataLoader<
  string,
  University
> {
  constructor(private readonly universitiesService: UniversitiesService) {
    super();
  }

  protected getOptions = () => ({
    query: (keys: readonly string[]) => {
      return this.universitiesService.getUniversitiesById(keys);
    },
  });
}
