import { Injectable, Logger, HttpService } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { Keys } from 'src/constants/keys';

interface UserInfo {
  sub: string;
  given_name: string;
  family_name: string;
  nickname: string;
  name: string;
  picture: string;
  locale: string;
  updated_at: Date;
  email: string;
  email_verified: boolean;
}

@Injectable()
export class UserRepository {
  private _logger = new Logger('UserRepository');

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private httpService: HttpService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<User> {
    this._logger.debug(`Searching for user with id: ${id}`);
    return await this.userModel.findById(id);
  }

  async createUser(accessToken: string): Promise<User> {
    var userInfo = await this.fetchUserInfo(accessToken);
    this._logger.debug(`Creating user with userInfo: ${userInfo}.`);

    const createdUser = new this.userModel({
      _id: userInfo.sub,
      ...userInfo,
    });
    var user = createdUser.save();

    this._logger.debug(`Created user with jwtPayload: ${userInfo}.`);
    return user;
  }

  async fetchUserInfo(accessToken: string): Promise<UserInfo> {
    var userInfoResponse = await this.httpService
      .get(`https://${Keys.auth_domain}/userinfo`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .toPromise();

    var userInfo = userInfoResponse.data;
    return userInfo;
  }
}
