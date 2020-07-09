import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FloodTestResultSummary } from './schemas/flood-test-result-summary.schema';

@Injectable()
export class FloodTestResultSummaryRepository {
  private _logger = new Logger('FloodTestResultSummaryRepository');

  constructor(
    @InjectModel(FloodTestResultSummary.name)
    private floodTestResultSummaryModel: Model<FloodTestResultSummary>,
  ) {}

  async delete(id: string) {
    await this.floodTestResultSummaryModel.deleteMany({
      testId: id,
    });
  }
}
