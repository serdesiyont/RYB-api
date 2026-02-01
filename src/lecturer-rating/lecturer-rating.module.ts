import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LecturerRatingService } from './lecturer-rating.service';
import { LecturerRatingController } from './lecturer-rating.controller';
import {
  LecturerRating,
  LecturerRatingSchema,
} from '../schema/lecturer-rating.schema';
import { Lecturer, LecturerSchema } from '../schema/lecturer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LecturerRating.name, schema: LecturerRatingSchema },
      { name: Lecturer.name, schema: LecturerSchema },
    ]),
  ],
  controllers: [LecturerRatingController],
  providers: [LecturerRatingService],
  exports: [LecturerRatingService],
})
export class LecturerRatingModule {}
