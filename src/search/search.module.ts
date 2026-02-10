import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { Lecturer, LecturerSchema } from '../schema/lecturer.schema';
import { Campus, CampusSchema } from '../schema/campus.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Lecturer.name, schema: LecturerSchema },
      { name: Campus.name, schema: CampusSchema },
    ]),
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
