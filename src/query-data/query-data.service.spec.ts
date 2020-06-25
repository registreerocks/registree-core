import { Test, TestingModule } from '@nestjs/testing';
import { QueryDataService } from './query-data.service';

describe('QueryDataService', () => {
  let service: QueryDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QueryDataService],
    }).compile();

    service = module.get<QueryDataService>(QueryDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
