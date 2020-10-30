import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private _logger = new Logger('JwtAuthGuard');

  canActivate(context: ExecutionContext) {
    this._logger.debug('Activating JwtAuthGuard...');
    const accessToken = context.switchToHttp().getRequest().headers[
      'x-api-key'
    ];
    if (accessToken) {
      this._logger.debug('API Access token found skipping JwtAuthGuard...');
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
