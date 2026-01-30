import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';
import { Campus } from './campus.schema';

export type CampusRatingDocument = CampusRating & Document;

@Schema({ timestamps: true })
export class CampusRating {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ type: Types.ObjectId, ref: 'Campus', required: true })
  campusId: Campus;

  @Prop({ required: true })
  reputation: number;

  @Prop({ required: true })
  social: number;

  @Prop({ required: true })
  clubs: number;

  @Prop({ required: true })
  opportunities: number;

  @Prop({ required: true })
  location: number;

  @Prop({ required: true })
  happiness: number;

  @Prop({ required: true })
  facilities: number;

  @Prop({ required: true })
  safety: number;

  @Prop({ required: true })
  internet: number;

  @Prop({ required: true })
  food: number;
}

export const CampusRatingSchema = SchemaFactory.createForClass(CampusRating);
