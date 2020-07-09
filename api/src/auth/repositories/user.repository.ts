import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class UserRepository {
  private _logger = new Logger('UserRepository');

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<User> {
    this._logger.debug(`Searching for user with id: ${id}`);
    return await this.userModel.findById(id);
  }

  async createUser(jwtPayload: JwtPayload): Promise<User> {
    this._logger.debug(`Creating user with jwtPayload: ${jwtPayload}.`);

    const createdUser = new this.userModel({
      sub: jwtPayload.sub,
      _id: jwtPayload.sub,
    });
    var user = createdUser.save();

    this._logger.debug(`Created user with jwtPayload: ${jwtPayload}.`);
    return user;
  }
}
