import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as BaseStrategy, ExtractJwt } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';

import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from 'src/common/interfaces/user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(BaseStrategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${configService.get<string>(
          'auth.domain',
        )}/.well-known/jwks.json`,
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: configService.get<string>('auth.audience'),
      issuer: `https://${configService.get<string>('auth.domain')}/`,
      algorithms: ['RS256'],
    });
  }

  validate(payload: JwtPayload): User {
    const dbId = payload['https://registree.com/db_id'];
    if (!dbId) {
      throw new UnauthorizedException(
        'JWT does not have the required database id.',
      );
    }
    return {
      dbId,
    };
  }
}
