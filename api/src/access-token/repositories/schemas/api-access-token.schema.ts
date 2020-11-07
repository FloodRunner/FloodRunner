import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ApiAccessToken extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  description: string;

  @Prop({ required: true, default: new Date() })
  createdAt: Date;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ required: true })
  value: string;
}

export const ApiAccessTokenSchema = SchemaFactory.createForClass(
  ApiAccessToken,
);
