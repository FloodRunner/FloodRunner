import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class FloodTestResultSummary extends Document {
  @Prop({ required: true })
  testId: string;

  @Prop({ required: true })
  testRunName: string;

  @Prop({ required: false })
  isCompleted: boolean;

  @Prop({ required: false })
  isSuccessful: boolean;

  @Prop({ type: [String], required: false })
  logFileUris: string[];

  @Prop({ type: [String], required: false })
  screenShotUris: string[];

  @Prop({ required: true })
  runOn: Date;
}

export const FloodTestResultSummarySchema = SchemaFactory.createForClass(
  FloodTestResultSummary,
);
