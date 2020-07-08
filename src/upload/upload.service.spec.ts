import { Test, TestingModule } from '@nestjs/testing';
import { UploadService } from './upload.service';
import { OBJECT_STORAGE } from './upload.constants';

describe('UploadService', () => {
  let service: UploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadService,
        {
          provide: OBJECT_STORAGE,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<UploadService>(UploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
