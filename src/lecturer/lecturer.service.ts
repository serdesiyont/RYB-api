import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLecturerDto } from './dto/create-lecturer.dto';
import { UpdateLecturerDto } from './dto/update-lecturer.dto';
import { Lecturer, LecturerDocument } from '../schema/lecturer.schema';

@Injectable()
export class LecturerService {
  constructor(
    @InjectModel(Lecturer.name) private lecturerModel: Model<LecturerDocument>,
  ) {}

  async create(createLecturerDto: CreateLecturerDto): Promise<Lecturer> {
    const createdLecturer = new this.lecturerModel(createLecturerDto);
    return await createdLecturer.save();
  }

  async findAll(): Promise<Lecturer[]> {
    return await this.lecturerModel.find().exec();
  }

  async findOne(id: string): Promise<Lecturer> {
    return await this.lecturerModel.findById(id).exec();
  }

  async update(
    id: string,
    updateLecturerDto: UpdateLecturerDto,
  ): Promise<Lecturer> {
    return await this.lecturerModel
      .findByIdAndUpdate(id, updateLecturerDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Lecturer> {
    return await this.lecturerModel.findByIdAndDelete(id).exec();
  }

  async addCourse(lecturerId: string, course: string): Promise<Lecturer> {
    return await this.lecturerModel
      .findByIdAndUpdate(
        lecturerId,
        { $push: { courses: course } },
        { new: true },
      )
      .exec();
  }

  async removeCourse(lecturerId: string, course: string): Promise<Lecturer> {
    return await this.lecturerModel
      .findByIdAndUpdate(
        lecturerId,
        { $pull: { courses: course } },
        { new: true },
      )
      .exec();
  }
}
