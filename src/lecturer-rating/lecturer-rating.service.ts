import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { LecturerRating, LecturerRatingDocument } from '../schema/lecturer-rating.schema';
import { Lecturer, LecturerDocument } from '../schema/lecturer.schema';
import { CreateLecturerRatingDto } from './dto/create-lecturer-rating.dto';
import { UpdateLecturerRatingDto } from './dto/update-lecturer-rating.dto';

@Injectable()
export class LecturerRatingService {
  constructor(
    @InjectModel(LecturerRating.name)
    private lecturerRatingModel: Model<LecturerRatingDocument>,
    @InjectModel(Lecturer.name)
    private lecturerModel: Model<LecturerDocument>,
  ) {}

  async create(createLecturerRatingDto: CreateLecturerRatingDto, userId: string): Promise<LecturerRating> {
    try {
      // Validate and convert lecturerId to ObjectId
      if (!Types.ObjectId.isValid(createLecturerRatingDto.lecturerId)) {
        throw new BadRequestException('Invalid lecturer ID format');
      }

      const lecturerId = new Types.ObjectId(createLecturerRatingDto.lecturerId);

      const rating = await this.lecturerRatingModel.create({
        ...createLecturerRatingDto,
        lecturerId,
        userId,
      });

      // Update lecturer rating after creating a new rating
      await this.updateLecturerRating(lecturerId);

      return rating;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to create lecturer rating');
    }
  }

  async findAll(): Promise<LecturerRating[]> {
    try {
      return await this.lecturerRatingModel
        .find()
        .populate('lecturerId')
        .exec();
    } catch (error) {
      throw new BadRequestException('Failed to fetch lecturer ratings');
    }
  }

  async findOne(id: string): Promise<LecturerRating> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid rating ID format');
      }

      const rating = await this.lecturerRatingModel
        .findById(id)
        .populate('lecturerId')
        .exec();

      if (!rating) {
        throw new NotFoundException(`Lecturer rating with ID ${id} not found`);
      }

      return rating;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch lecturer rating');
    }
  }

  async findByLecturer(lecturerId: string): Promise<LecturerRating[]> {
    try {
      if (!Types.ObjectId.isValid(lecturerId)) {
        throw new BadRequestException('Invalid lecturer ID format');
      }

      return await this.lecturerRatingModel
        .find({ lecturerId: new Types.ObjectId(lecturerId) })
        .exec();
    } catch (error) {
      throw new BadRequestException('Failed to fetch lecturer ratings');
    }
  }

  async findByUser(userId: string): Promise<LecturerRating[]> {
    try {
      return await this.lecturerRatingModel
        .find({ userId })
        .populate('lecturerId')
        .exec();
    } catch (error) {
      throw new BadRequestException('Failed to fetch user ratings');
    }
  }

  async update(id: string, updateLecturerRatingDto: UpdateLecturerRatingDto): Promise<LecturerRating> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid rating ID format');
      }

      const rating = await this.lecturerRatingModel
        .findByIdAndUpdate(id, updateLecturerRatingDto, { new: true })
        .populate('lecturerId')
        .exec();

      if (!rating) {
        throw new NotFoundException(`Lecturer rating with ID ${id} not found`);
      }

      // Update lecturer rating after updating a rating
      await this.updateLecturerRating(rating.lecturerId as any);

      return rating;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update lecturer rating');
    }
  }

  async remove(id: string): Promise<LecturerRating> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid rating ID format');
      }

      const rating = await this.lecturerRatingModel
        .findByIdAndDelete(id)
        .exec();

      if (!rating) {
        throw new NotFoundException(`Lecturer rating with ID ${id} not found`);
      }

      // Update lecturer rating after deleting a rating
      await this.updateLecturerRating(rating.lecturerId as any);

      return rating;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete lecturer rating');
    }
  }

  private async updateLecturerRating(lecturerId: Types.ObjectId): Promise<void> {
    try {
      // Fetch all ratings for this lecturer
      const ratings = await this.lecturerRatingModel.find({ lecturerId }).exec();

      if (ratings.length === 0) {
        // No ratings, set to 0
        await this.lecturerModel
          .findByIdAndUpdate(lecturerId, { rating: 0, count: 0 })
          .exec();
        return;
      }

      // Calculate average rating from difficulty and quality
      const totalRating = ratings.reduce((sum, rating) => {
        // Average of difficulty and quality for each rating
        const avgRating = (rating.difficulty + rating.quality) / 2;
        return sum + avgRating;
      }, 0);

      const averageRating = totalRating / ratings.length;
      const roundedRating = Math.round(averageRating * 100) / 100;

      // Update lecturer with new average rating and count
      await this.lecturerModel
        .findByIdAndUpdate(lecturerId, {
          rating: roundedRating,
          count: ratings.length,
        })
        .exec();
    } catch (error) {
      // Log error but don't throw to avoid breaking the main operation
      console.error('Error updating lecturer rating:', error);
    }
  }
}
