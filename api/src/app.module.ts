import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FloodtestModule } from './floodtest/floodtest.module';
import { Keys } from './constants/keys';
import { StorageModule } from './storage/storage.module';
import { SchedulingModule } from './scheduling/scheduling.module';
import { AccessTokenModule } from './access-token/access-token.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      Keys.buildMongoDbConnectionString(Keys.mongoDbFloodDatabaseName),
    ),
    FloodtestModule,
    StorageModule,
    SchedulingModule,
    AccessTokenModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
