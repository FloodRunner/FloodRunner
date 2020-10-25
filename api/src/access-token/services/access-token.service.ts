import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { User } from 'src/auth/repositories/schemas/user.schema';
import { AccessTokenDto } from '../dtos/access-token.dto';
import { CreateApiAccessTokenDto } from '../dtos/create-accesstoken.dto';
import { ApiAccessTokenRepository } from '../repositories/api-access-token.repository';

@Injectable()
export class AccessTokenService {
  private _logger = new Logger('AccessTokenService');

  constructor(private accessTokenRepository: ApiAccessTokenRepository) {}

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
}
