import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LecturerDocument = Lecturer & Document;

@Schema({ timestamps: true })
export class Lecturer {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  university: string;

  @Prop({ required: true })
  department: string;

  @Prop([String])
  courses: string[];

  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: 0 })
  count: number;
}

export const LecturerSchema = SchemaFactory.createForClass(Lecturer);
