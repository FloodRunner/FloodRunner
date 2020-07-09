import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FloodtestModule } from './floodtest/floodtest.module';
import { Keys } from './constants/keys';
import { StorageModule } from './storage/storage.module';
import { MessagingModule } from './messaging/messaging.module';
import { SchedulingModule } from './scheduling/scheduling.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      Keys.buildMongoDbConnectionString(Keys.mongoDbFloodDatabaseName),
    ),
    FloodtestModule,
    StorageModule,
    MessagingModule,
    SchedulingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
