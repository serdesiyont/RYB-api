import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CampusDocument = Campus & Document;

@Schema({ timestamps: true })
export class Campus {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  address: string;

  @Prop()
  description: string;

  @Prop({ default: 0 })
  overallRating: number;

  @Prop()
  imageUrl: string;
}

export const CampusSchema = SchemaFactory.createForClass(Campus);
