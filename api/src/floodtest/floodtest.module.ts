import { HttpModule, Module } from '@nestjs/common';
import { FloodtestService } from './services/floodtest.service';
import { FloodtestController } from './floodtest.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FloodTestSchema } from './repositories/schemas/flood-test.schema';
import {
  FloodTestResultSummarySchema,
  FloodTestResultSummary,
} from './repositories/schemas/flood-test-result-summary.schema';
import {
  FloodTestResultOverviewSchema,
  FloodTestResultOverview,
} from './repositories/schemas/flood-test-result-overview.schema';
import { FloodTestJobService } from './services/flood-test-job.service';
import { AuthModule } from '../auth/auth.module';
import { StorageModule } from '../storage/storage.module';
import { SchedulingModule } from '../scheduling/scheduling.module';
import { FloodTest } from './repositories/schemas/flood-test.schema';
import { FloodTestRepository } from './repositories/floodtest.repository';
import { FloodTestResultSummaryRepository } from './repositories/floodtest-result-summary.repository';
import { AccessTokenModule } from '../access-token/access-token.module';
import { SandboxRunnerService } from './services/sandbox-runner.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FloodTest.name, schema: FloodTestSchema },
      {
        name: FloodTestResultOverview.name,
        schema: FloodTestResultOverviewSchema,
      },
      {
        name: FloodTestResultSummary.name,
        schema: FloodTestResultSummarySchema,
      },
    ]),
    AuthModule,
    StorageModule,
    SchedulingModule,
    AccessTokenModule,
    HttpModule.register({
      timeout: 180000, //3 minute timeout
    }),
  ],
  providers: [
    FloodtestService,
    SandboxRunnerService,
    FloodTestJobService,
    FloodTestRepository,
    FloodTestResultSummaryRepository,
  ],
  controllers: [FloodtestController],
})
export class FloodtestModule {}
