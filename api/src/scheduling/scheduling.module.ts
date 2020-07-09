import { Module } from '@nestjs/common';
import { MessagingModule } from '../messaging/messaging.module';
import { AgendaService } from './services/agenda.service';

@Module({
  imports: [MessagingModule],
  providers: [AgendaService],
  exports: [AgendaService],
})
export class SchedulingModule {}
