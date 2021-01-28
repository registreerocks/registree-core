import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from './customers.service';
import { Customer } from './models/customer.model';
import { getModelToken } from '@nestjs/mongoose';
import { Auth0DataService } from 'src/auth0-data/auth0-data.service';

describe('CustomersService', () => {
  let service: CustomersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: Auth0DataService,
          useValue: {},
        },
        {
          provide: getModelToken(Customer.name),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
