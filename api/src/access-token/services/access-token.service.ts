import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as moment from 'moment';
import { User } from 'src/auth/repositories/schemas/user.schema';
import { UserRepository } from 'src/auth/repositories/user.repository';
import { AccessTokenDto } from '../dtos/access-token.dto';
import { CreateApiAccessTokenDto } from '../dtos/create-accesstoken.dto';
import { ApiAccessTokenRepository } from '../repositories/api-access-token.repository';

@Injectable()
export class AccessTokenService {
  private _logger = new Logger('AccessTokenService');

  constructor(
    private accessTokenRepository: ApiAccessTokenRepository,
    private userRepository: UserRepository,
  ) {}

  /**
   * Creates an API Access Token for the user
   * @param user the user entity
   * @param createApiAccessTokenDto The details of the access token to create
   */
  async create(
    user: User,
    createApiAccessTokenDto: CreateApiAccessTokenDto,
  ): Promise<string> {
    this._logger.log(`Creating access token for user, userId: ${user._id}`);
    return this.accessTokenRepository.create(user, createApiAccessTokenDto);
  }

  /**
   * Deletes API Access Token for the user
   * @param user the user entity
   * @param accessTokenId the id of the access token
   */
  async delete(user: User, accessTokenId: string) {
    var isDeleted = await this.accessTokenRepository.delete(
      user,
      accessTokenId,
    );
  }

  /**
   * Finds all flood tests
   * @param user [optional] The user entity
   */
  async findAll(user?: User): Promise<AccessTokenDto[]> {
    return this.accessTokenRepository.findAll(user);
  }

  /**
   * Validates if the access token exists and is still valid
   * @param accessTokenModel access token model
   */
  async validate(accessToken: string): Promise<boolean> {
    var accessTokenModel = await this.accessTokenRepository.find(accessToken);

    //validate expiry using moment
    if (moment(accessTokenModel.expiresAt).isBefore(moment.now())) {
      this._logger.debug('Access token is expired...');
      return false;
    }
    return true;
  }

  /**
   * Find the user from the access token
   * @param accessToken access token
   */
  async getUserFromToken(accessToken: string): Promise<User> {
    var accessTokenModel = await this.accessTokenRepository.find(accessToken);
    return await this.userRepository.findById(accessTokenModel.userId);
  }
}
