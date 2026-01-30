import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LecturerModule } from './lecturer/lecturer.module';
import { CampusModule } from './campus/campus.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/rypDB', {}),
    LecturerModule,
    CampusModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
