import { Injectable, NotFoundException } from '@nestjs/common';
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
    return this.lecturerModel.create(createLecturerDto);
  }

  async findAll(): Promise<Lecturer[]> {
    return await this.lecturerModel.find().exec();
  }

  async findOne(id: string): Promise<Lecturer> {
    const lecturer = await this.lecturerModel.findById(id).exec();
    if (!lecturer) {
      throw new NotFoundException(`Lecturer with ID "${id}" not found`);
    }
    return lecturer;
  }

  async update(
    id: string,
    updateLecturerDto: UpdateLecturerDto,
  ): Promise<Lecturer> {
    const existingLecturer = await this.lecturerModel
      .findByIdAndUpdate(id, updateLecturerDto, { new: true })
      .exec();
    if (!existingLecturer) {
      throw new NotFoundException(`Lecturer with ID "${id}" not found`);
    }
    return existingLecturer;
  }

  async remove(id: string): Promise<Lecturer> {
    const deletedLecturer = await this.lecturerModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedLecturer) {
      throw new NotFoundException(`Lecturer with ID "${id}" not found`);
    }
    return deletedLecturer;
  }

  async addCourse(lecturerId: string, course: string): Promise<Lecturer> {
    const lecturer = await this.lecturerModel
      .findByIdAndUpdate(
        lecturerId,
        { $push: { courses: course } },
        { new: true },
      )
      .exec();
    if (!lecturer) {
      throw new NotFoundException(`Lecturer with ID "${lecturerId}" not found`);
    }
    return lecturer;
  }

  async removeCourse(lecturerId: string, course: string): Promise<Lecturer> {
    const lecturer = await this.lecturerModel
      .findByIdAndUpdate(
        lecturerId,
        { $pull: { courses: course } },
        { new: true },
      )
      .exec();
    if (!lecturer) {
      throw new NotFoundException(`Lecturer with ID "${lecturerId}" not found`);
    }
    return lecturer;
  }
}
