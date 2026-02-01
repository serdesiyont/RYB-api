import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LecturerRatingDocument = LecturerRating & Document;

@Schema({ timestamps: true })
export class LecturerRating {
  @Prop({ type: Types.ObjectId, ref: 'Lecturer', required: true })
  lecturerId: Types.ObjectId;

  @Prop({ type: String, ref: 'user', required: true })
  userId: string;

  @Prop({ required: true })
  course: string;

  @Prop({ required: true })
  difficulty: number;

  @Prop({ required: true })
  quality: number;

  @Prop({ required: true })
  creditHr: number;

  @Prop({ required: true })
  grade: string;

  @Prop({ default: false })
  textbook: boolean;

  @Prop()
  comment: string;
}

export const LecturerRatingSchema =
  SchemaFactory.createForClass(LecturerRating);
