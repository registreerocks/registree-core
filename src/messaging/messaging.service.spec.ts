import { Test, TestingModule } from '@nestjs/testing';
import { MessagingService } from './messaging.service';
import { MESSAGING_OPTIONS } from './messaging.constants';

describe('MessagingService', () => {
  let service: MessagingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagingService,
        {
          provide: MESSAGING_OPTIONS,
          useValue: {
            accountSid: 'ACsomeaccountsid',
            authToken: 'someauthtoken',
          },
        },
      ],
    }).compile();

    service = module.get<MessagingService>(MessagingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
