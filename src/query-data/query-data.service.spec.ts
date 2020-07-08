import { Test, TestingModule } from '@nestjs/testing';
import { QueryDataService } from './query-data.service';
import { getLoggerToken } from 'nestjs-pino';
import { Provider } from '@nestjs/common';
import { QueryDataOptions } from './query-data.options';
import { QUERY_DATA_OPTIONS } from './query-data.constants';
import { AuthService } from 'src/auth/auth.service';

describe('QueryDataService', () => {
  let service: QueryDataService;

  beforeEach(async () => {
    const optionsProvider: Provider<QueryDataOptions> = {
      provide: QUERY_DATA_OPTIONS,
      useValue: {
        queryApi: 'test.query.api',
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueryDataService,
        optionsProvider,
        {
          provide: AuthService,
          useValue: {},
        },
        {
          provide: getLoggerToken(QueryDataService.name),
          useValue: {},
        },
      ],
    }).compile();
    service = module.get<QueryDataService>(QueryDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
