import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class FloodTestResultOverview extends Document {
  @Prop({ required: true })
  isPassing: boolean;

  @Prop({ required: false })
  lastRun: Date;
}

export const FloodTestResultOverviewSchema = SchemaFactory.createForClass(
  FloodTestResultOverview,
);
