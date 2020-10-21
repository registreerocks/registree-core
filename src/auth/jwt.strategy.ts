import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as BaseStrategy, ExtractJwt } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from 'src/common/interfaces/user.interface';
import { AuthOptions } from './auth.options';
import { AUTH_OPTIONS } from './auth.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(BaseStrategy) {
  constructor(@Inject(AUTH_OPTIONS) private readonly options: AuthOptions) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${options.domain}/.well-known/jwks.json`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: options.ignoreExpiration,
      audience: options.audience,
      issuer: `https://${options.domain}/`,
      algorithms: ['RS256'],
    });
  }

  validate(payload: JwtPayload): User {
    const dbId = payload['https://registree.com/db_id'];
    const email = payload['https://registree.com/email'];
    if (!dbId || !payload.scope || !payload.sub) {
      throw new UnauthorizedException(
        'JWT does not have the required attributes.',
      );
    }
    return {
      dbId,
      scope: payload.scope,
      userId: payload.sub,
      email,
    };
  }
}
