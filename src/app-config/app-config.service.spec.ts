import { Test, TestingModule } from '@nestjs/testing';
import { AppConfigService } from './app-config.service';
import { AppConfig } from './config/app.config';
import { ApiConfig } from './config/api.config';
import { StorageConfig } from './config/storage.config';
import { AuthConfig } from './config/auth.config';
import { PricingConfig } from './config/pricing.config';

describe('AppConfigService', () => {
  let service: AppConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppConfigService,
        { provide: AppConfig.KEY, useValue: {} },
        { provide: ApiConfig.KEY, useValue: {} },
        { provide: StorageConfig.KEY, useValue: {} },
        { provide: AuthConfig.KEY, useValue: {} },
        { provide: PricingConfig.KEY, useValue: {} },
      ],
    }).compile();

    service = module.get<AppConfigService>(AppConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
