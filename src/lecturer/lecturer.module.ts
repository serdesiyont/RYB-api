import { Module } from '@nestjs/common';
import { LecturerService } from './lecturer.service';
import { LecturerController } from './lecturer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Lecturer, LecturerSchema } from '../schema/lecturer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Lecturer.name, schema: LecturerSchema },
    ]),
  ],
  providers: [LecturerService],
  controllers: [LecturerController],
})
export class LecturerModule {}
