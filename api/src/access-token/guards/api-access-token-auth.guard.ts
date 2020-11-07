import {
  ExecutionContext,
  Injectable,
  Logger,
  CanActivate,
} from '@nestjs/common';
import { AccessTokenService } from '../services/access-token.service';

@Injectable()
export class ApiAccessTokenAuthGuard implements CanActivate {
  private _logger = new Logger('ApiAccessTokenAuthGuard');

  constructor(private accessTokenService: AccessTokenService) {}

  async canActivate(context: ExecutionContext) {
    this._logger.debug('Activating ApiAccessTokenAuthGuard...');

    const accessToken = context.switchToHttp().getRequest().headers[
      'x-api-key'
    ];
    if (accessToken) {
      if (await this.accessTokenService.validate(accessToken)) {
        const req = context.switchToHttp().getRequest();
        req.user = await this.accessTokenService.getUserFromToken(accessToken);
        return true;
      }

      return false;
    }

    this._logger.debug(
      'API Access token not found skipping ApiAccessTokenAuthGuard...',
    );
    return true;
  }
}
