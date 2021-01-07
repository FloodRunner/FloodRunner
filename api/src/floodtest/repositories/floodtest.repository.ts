import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FloodTest } from './schemas/flood-test.schema';
import { Model } from 'mongoose';
import { CreateFloodTestDto } from '../dtos/create-floodtest.dto';
import { User } from '../../auth/repositories/schemas/user.schema';

interface deleteResult {
  n: number | null;
  ok: number | null;
  deletedCount: number | null;
}

@Injectable()
export class FloodTestRepository {
  private _logger = new Logger('FloodTestRepository');

  constructor(
    @InjectModel(FloodTest.name) private floodTestModel: Model<FloodTest>,
  ) {}

  async create(
    testId: string,
    user: User,
    testUri: string,
    createFloodTestDto: CreateFloodTestDto,
  ): Promise<FloodTest> {
    const createdFloodTest = new this.floodTestModel({
      resultOverview: {
        isPassing: null,
        lastRun: null,
      },
      userId: user._id,
      _id: testId,
      uri: testUri,
      ...createFloodTestDto,
    });

    return createdFloodTest.save();
  }

  async update(
    user: User,
    id: string,
    createFloodTestDto: CreateFloodTestDto,
  ): Promise<FloodTest> {
    var updatedFloodTest = await this.floodTestModel.updateOne(
      {
        _id: id,
        userId: user._id,
      },
      createFloodTestDto,
      { new: true },
    );

    return updatedFloodTest;
  }

  async findAll(user?: User): Promise<FloodTest[]> {
    //no user supplied get all flood tests
    if (!user) return this.floodTestModel.find().exec();

    //user supplied filter tests by user id
    return this.floodTestModel
      .find({
        userId: user._id,
      })
      .exec();
  }

  async findById(user: User, id: string): Promise<FloodTest> {
    return this.floodTestModel.findOne({
      userId: user._id,
      _id: id,
    });
  }

  async delete(user: User, id: string): Promise<boolean> {
    var deleteResult = (await this.floodTestModel.deleteOne({
      userId: user._id,
      _id: id,
    })) as deleteResult;

    return deleteResult.ok ? true : false;
  }

  async isCreator(user: User, id: string): Promise<boolean> {
    this._logger.debug(`Searching for test with id: ${id}`);

    try {
      const test = await this.floodTestModel.findOne({
        _id: id,
      });

      return test.userId == user.id;
    } catch (err) {
      this._logger.error(`Test with id: ${id} was not found`);
      throw new NotFoundException(
        `Specified test with id: ${id} does not exist.`,
      );
    }
  }
}
