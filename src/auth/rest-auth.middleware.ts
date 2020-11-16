import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { authenticate } from 'passport';

@Injectable()
export class RestAuthMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    /* eslint-disable */
    authenticate(
      'headerapikey',
      { session: false, failureRedirect: '/api/unauthorized' },
      value => {
        if (value) {
          next();
        } else {
          throw new UnauthorizedException();
        }
      },
    )(req, res, next);
    /* eslint-enable */
  }
}
