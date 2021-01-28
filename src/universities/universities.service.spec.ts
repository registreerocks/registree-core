import { Test, TestingModule } from '@nestjs/testing';
import { UniversitiesService } from './universities.service';
import { getModelToken } from '@nestjs/mongoose';
import { Degree } from './models/degree.model';
import { University } from './models/university.model';
import { Faculty } from './models/faculty.model';

describe('UniversitiesService', () => {
  let service: UniversitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UniversitiesService,
        {
          provide: getModelToken(Degree.name),
          useValue: {},
        },
        {
          provide: getModelToken(University.name),
          useValue: {},
        },
        {
          provide: getModelToken(Faculty.name),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<UniversitiesService>(UniversitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
