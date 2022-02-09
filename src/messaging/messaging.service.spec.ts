import { Test, TestingModule } from '@nestjs/testing';
import { MessagingService } from './messaging.service';
import { TwilioModuleOptions } from 'nestjs-twilio';
import { TwilioModule } from 'nestjs-twilio';

describe('MessagingService', () => {
  let service: MessagingService;

  const TWILIO_ACCOUNT_SID = 'ACsomeaccountsid';
  const TWILIO_AUTH_TOKEN = 'someauthtoken';

  const config: TwilioModuleOptions = {
    accountSid: TWILIO_ACCOUNT_SID,
    authToken: TWILIO_AUTH_TOKEN,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TwilioModule.forRoot(config)],
      providers: [MessagingService],
    }).compile();

    service = module.get<MessagingService>(MessagingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
