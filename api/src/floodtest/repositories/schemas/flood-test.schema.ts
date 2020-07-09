import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { FloodTestResultOverview } from './flood-test-result-overview.schema';

@Schema()
export class FloodTest extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  interval: number;

  @Prop({ required: true })
  uri: string;

  @Prop({ required: true })
  resultOverview: FloodTestResultOverview;
}

export const FloodTestSchema = SchemaFactory.createForClass(FloodTest);
