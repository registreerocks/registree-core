import { Test, TestingModule } from '@nestjs/testing';
import { QueriesService } from './queries.service';
import { UploadService } from 'src/upload/upload.service';
import { QueryDataService } from 'src/query-data/query-data.service';
import { PricingService } from 'src/pricing/pricing.service';

describe('QueriesService', () => {
  let service: QueriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueriesService,
        {
          provide: UploadService,
          useValue: {},
        },
        {
          provide: QueryDataService,
          useValue: {},
        },
        {
          provide: PricingService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<QueriesService>(QueriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
