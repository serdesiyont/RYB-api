import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LecturerModule } from './lecturer/lecturer.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/rypDB', {}),
    LecturerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
