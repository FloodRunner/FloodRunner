import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as BaseStrategy, ExtractJwt } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';

import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { Keys } from '../../constants/keys';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../repositories/schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(BaseStrategy) {
  private _logger = new Logger('JwtStrategy');

  constructor(private userRepository: UserRepository) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${Keys.auth_domain}/.well-known/jwks.json`,
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: Keys.auth_audience,
      issuer: `https://${Keys.auth_domain}/`,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const minimumScope = ['openid', 'profile', 'email'];

    if (
      payload?.scope
        ?.split(' ')
        .filter(scope => minimumScope.indexOf(scope) > -1).length !== 3
    ) {
      var message =
        'JWT does not possess the required scope (`openid profile email`).';
      this._logger.error(message);
      throw new UnauthorizedException(message);
    }

    //create user if not exists
    let user = await this.userRepository.findById(payload.sub);
    if (!user) {
      this._logger.log(`User with subjectId: ${payload.sub} not found.`);
      user = await this.userRepository.createUser(payload);
    }

    return user;
  }
}
