import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  sub: string;

  @Prop({ required: true })
  _id: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
