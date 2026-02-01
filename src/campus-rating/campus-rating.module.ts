import { Module } from '@nestjs/common';
import { CampusRatingService } from './campus-rating.service';
import { CampusRatingController } from './campus-rating.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CampusRating,
  CampusRatingSchema,
} from '../schema/campus-rating.schema';
import { Campus, CampusSchema } from '../schema/campus.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CampusRating.name, schema: CampusRatingSchema },
      { name: Campus.name, schema: CampusSchema },
    ]),
  ],
  controllers: [CampusRatingController],
  providers: [CampusRatingService],
  exports: [CampusRatingService],
})
export class CampusRatingModule {}
