import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfig } from './config/app.config';
import { ApiConfig } from './config/api.config';
import { StorageConfig } from './config/storage.config';
import { AuthConfig } from './config/auth.config';
import { AppConfigService } from './app-config.service';
import { PricingConfig } from './config/pricing.config';
import { TwilioConfig } from './config/twilio.config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        AppConfig,
        ApiConfig,
        StorageConfig,
        AuthConfig,
        PricingConfig,
        TwilioConfig,
      ],
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
