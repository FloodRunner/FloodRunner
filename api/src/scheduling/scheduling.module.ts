import { Module } from '@nestjs/common';
import { AgendaService } from './services/agenda.service';
@Module({
  imports: [],
  providers: [AgendaService],
  exports: [AgendaService],
})
export class SchedulingModule {}
