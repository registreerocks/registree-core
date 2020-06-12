import { Test, TestingModule } from '@nestjs/testing';
import { QueriesResolver } from './queries.resolver';

describe('QueriesResolver', () => {
  let resolver: QueriesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QueriesResolver],
    }).compile();

    resolver = module.get<QueriesResolver>(QueriesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
