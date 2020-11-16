import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy) {
  constructor(private authService: AuthService) {
    /* eslint-disable */
    super(
      { header: 'X-API-KEY', prefix: '' },
      true,
      (apiKey: string, done: any) => {
        const checkKey = authService.validateApiKey(apiKey);
        if (!checkKey) {
          return done(false);
        }
        return done(true);
      },
    );
    /* eslint-enable */
  }
}
