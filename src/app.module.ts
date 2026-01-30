import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LecturerController } from './lecturer/lecturer.controller';
import { LecturerModule } from './lecturer/lecturer.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/rypDB', {}),
    LecturerModule,
  ],
  controllers: [LecturerController],
  providers: [],
})
export class AppModule {}
