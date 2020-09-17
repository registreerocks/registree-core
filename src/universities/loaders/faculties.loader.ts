import { Injectable, Scope } from '@nestjs/common';
import { OrderedNestDataLoader } from 'nestjs-graphql-dataloader';
import { UniversitiesService } from '../universities.service';
import { Faculty } from '../models/faculty.model';

@Injectable({ scope: Scope.REQUEST })
export class FacultiesLoader extends OrderedNestDataLoader<string, Faculty> {
  constructor(private readonly universitiesService: UniversitiesService) {
    super();
  }

  protected getOptions = () => ({
    query: (keys: readonly string[]) => {
      return this.universitiesService.getFacultiesById(keys);
    },
  });
}
