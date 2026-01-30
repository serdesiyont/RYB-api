import { Module } from '@nestjs/common';
import { CampusService } from './campus.service';
import { CampusController } from './campus.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Campus, CampusSchema } from '../schema/campus.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Campus.name, schema: CampusSchema }]),
  ],
  controllers: [CampusController],
  providers: [CampusService],
})
export class CampusModule {}
