import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Campus, CampusDocument } from '../schema/campus.schema';
import { CreateCampusDto } from './dto/create-campus.dto';
import { UpdateCampusDto } from './dto/update-campus.dto';

@Injectable()
export class CampusService {
  constructor(
    @InjectModel(Campus.name) private campusModel: Model<CampusDocument>,
  ) {}

  async create(createCampusDto: CreateCampusDto): Promise<Campus> {
    return this.campusModel.create(createCampusDto);
  }

  async findAll(): Promise<Campus[]> {
    return this.campusModel.find().exec();
  }

  async findOne(id: string): Promise<Campus> {
    const campus = await this.campusModel.findById(id).exec();
    if (!campus) {
      throw new NotFoundException(`Campus with ID "${id}" not found`);
    }
    return campus;
  }

  async update(id: string, updateCampusDto: UpdateCampusDto): Promise<Campus> {
    const existingCampus = await this.campusModel
      .findByIdAndUpdate(id, updateCampusDto, { new: true })
      .exec();
    if (!existingCampus) {
      throw new NotFoundException(`Campus with ID "${id}" not found`);
    }
    return existingCampus;
  }

  async remove(id: string): Promise<Campus> {
    const deletedCampus = await this.campusModel.findByIdAndDelete(id).exec();
    if (!deletedCampus) {
      throw new NotFoundException(`Campus with ID "${id}" not found`);
    }
    return deletedCampus;
  }
}
