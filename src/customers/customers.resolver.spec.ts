import { Test, TestingModule } from '@nestjs/testing';
import { CustomersResolver } from './customers.resolver';
import { CustomersService } from './customers.service';
import { Auth0DataService } from 'src/auth0-data/auth0-data.service';

describe('CustomersResolver', () => {
  let resolver: CustomersResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersResolver,
        { provide: CustomersService, useValue: {} },
        { provide: Auth0DataService, useValue: {} },
      ],
    }).compile();

    resolver = module.get<CustomersResolver>(CustomersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
