import { Module } from '@nestjs/common';
import { RabbitQueueService } from './services/rabbit-queue.service';

@Module({
  imports: [],
  providers: [RabbitQueueService],
  exports: [RabbitQueueService],
})
export class MessagingModule {}
