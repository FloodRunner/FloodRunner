import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { encode, TAlgorithm } from 'jwt-simple';
import { User } from '../../auth/repositories/schemas/user.schema';
import { ApiAccessToken } from './schemas/api-access-token.schema';
import { CreateApiAccessTokenDto } from '../dtos/create-accesstoken.dto';
import { AccessTokenDto } from '../dtos/access-token.dto';

interface deleteResult {
  n: number | null;
  ok: number | null;
  deletedCount: number | null;
}

@Injectable()
export class ApiAccessTokenRepository {
  private _logger = new Logger('ApiAccessTokenRepository');

  constructor(
    @InjectModel(ApiAccessToken.name)
    private apiAccessTokenModel: Model<ApiAccessToken>,
  ) {}

  private async generateAccessToken(userId: string): Promise<string> {
    // Always use HS512 to sign the token
    const algorithm: TAlgorithm = 'HS512';
    // Determine when the token should expire
    const issued = Date.now();
    const fifteenMinutesInMs = 15 * 60 * 1000;
    const expires = issued + fifteenMinutesInMs; //put this in ticks and change to exp, change createdAt to iat and put in ticks also

    const payload = {
      expires: expires,
      userId: userId,
    };

    const secretKey = 'randomKey';

    const token = encode(payload, secretKey, algorithm);
    this._logger.log(token);

    return token;
  }

  /**
   * Creates an API access token scoped to the user to be used by external systems
   * @param user The user creating the access token
   * @param createApiAccessTokenDto The details of the access token to create
   */
  async create(
    user: User,
    createApiAccessTokenDto: CreateApiAccessTokenDto,
  ): Promise<string> {
    //generate access token
    const accessToken = await this.generateAccessToken(user._id);

    await new this.apiAccessTokenModel({
      userId: user._id,
      value: accessToken,
      ...createApiAccessTokenDto,
    }).save();

    return accessToken;
  }

  //   async update(
  //     user: User,
  //     id: string,
  //     createFloodTestDto: CreateFloodTestDto,
  //   ): Promise<FloodTest> {
  //     var updatedFloodTest = await this.floodTestModel.updateOne(
  //       {
  //         _id: id,
  //         userId: user._id,
  //       },
  //       createFloodTestDto,
  //       { new: true },
  //     );

  //     return updatedFloodTest;
  //   }

  /**
   * Gets all api access tokens for the user
   * @param user the user
   */
  async findAll(user?: User): Promise<AccessTokenDto[]> {
    this._logger.log(user._id);
    //user supplied filter tests by user id
    var accessTokens = await this.apiAccessTokenModel
      .find(
        {
          userId: user._id,
        },
        ['name', 'description', 'createdAt', 'expiresAt'],
      )
      .exec();

    return (accessTokens as any) as AccessTokenDto[];
  }

  /**
   * Find the access token in the database
   * @param accessToken the access token stored in the database
   */
  async find(accessToken: string): Promise<ApiAccessToken> {
    this._logger.debug(
      `Searching for access token: ${accessToken.substring(0, 3)}...`,
    );
    var accessTokenModel = await this.apiAccessTokenModel
      .findOne({
        value: accessToken,
      })
      .exec();

    return accessTokenModel;
  }

  /**
   * Deletes access token
   * @param user the user associated with the access token
   * @param id the id of the access token
   */
  async delete(user: User, id: string): Promise<boolean> {
    var deleteResult = (await this.apiAccessTokenModel.deleteOne({
      userId: user._id,
      _id: id,
    })) as deleteResult;

    return deleteResult.ok ? true : false;
  }
}
