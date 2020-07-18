import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  sub: string;

  @Prop({ required: true })
  _id: string;

  @Prop({ required: false })
  given_name: string;

  @Prop({ required: false })
  family_name: string;

  @Prop({ required: false })
  nickname: string;

  @Prop({ required: false })
  name: string;

  @Prop({ required: false })
  picture: string;

  @Prop({ required: false })
  locale: string;

  @Prop({ required: false })
  updated_at: Date;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  email_verified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
