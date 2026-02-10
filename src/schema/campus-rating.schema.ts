import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CampusRatingDocument = CampusRating & Document;

@Schema({ timestamps: true })
export class CampusRating {
  @Prop({ type: String, ref: 'user', required: true })
  userId: string;

  @Prop({ type: Types.ObjectId, ref: 'Campus', required: true })
  campusId: Types.ObjectId;

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

  @Prop()
  comment: string;
}

export const CampusRatingSchema = SchemaFactory.createForClass(CampusRating);
