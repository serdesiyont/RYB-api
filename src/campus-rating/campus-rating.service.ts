import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  CampusRating,
  CampusRatingDocument,
} from '../schema/campus-rating.schema';
import { Campus, CampusDocument } from '../schema/campus.schema';
import { CreateCampusRatingDto } from './dto/create-campus-rating.dto';
import { UpdateCampusRatingDto } from './dto/update-campus-rating.dto';

@Injectable()
export class CampusRatingService {
  constructor(
    @InjectModel(CampusRating.name)
    private campusRatingModel: Model<CampusRatingDocument>,
    @InjectModel(Campus.name)
    private campusModel: Model<CampusDocument>,
  ) {}

  async create(
    createCampusRatingDto: CreateCampusRatingDto,
    userId: string,
  ): Promise<CampusRating> {
    try {
      // Validate ObjectId format
      if (!Types.ObjectId.isValid(createCampusRatingDto.campusId)) {
        throw new BadRequestException('Invalid campus ID format');
      }

      const rating = await this.campusRatingModel.create({
        ...createCampusRatingDto,
        campusId: new Types.ObjectId(createCampusRatingDto.campusId),
        userId,
      });

      // Update campus overall rating and count
      await this.updateCampusRating(createCampusRatingDto.campusId);

      return rating;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        'Error creating campus rating: ' + error.message,
      );
    }
  }

  async findAll(): Promise<CampusRating[]> {
    try {
      return await this.campusRatingModel
        .find()
        .populate('campusId', 'name address')
        .exec();
    } catch (error) {
      throw new BadRequestException(
        'Error retrieving campus ratings: ' + error.message,
      );
    }
  }

  async findOne(id: string): Promise<CampusRating> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid rating ID format');
    }

    try {
      const campusRating = await this.campusRatingModel
        .findById(id)
        .populate('campusId', 'name address')
        .exec();

      if (!campusRating) {
        throw new NotFoundException(`Campus rating with ID "${id}" not found`);
      }

      return campusRating;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        'Error retrieving campus rating: ' + error.message,
      );
    }
  }

  async findByCampus(campusId: string): Promise<CampusRating[]> {
    if (!Types.ObjectId.isValid(campusId)) {
      throw new BadRequestException('Invalid campus ID format');
    }

    try {
      return await this.campusRatingModel
        .find({ campusId: new Types.ObjectId(campusId) })
        .exec();
    } catch (error) {
      throw new BadRequestException(
        'Error retrieving ratings for campus: ' + error.message,
      );
    }
  }

  async findByUser(userId: string): Promise<CampusRating[]> {
    try {
      return await this.campusRatingModel
        .find({ userId })
        .populate('campusId', 'name address')
        .exec();
    } catch (error) {
      throw new BadRequestException(
        'Error retrieving ratings by user: ' + error.message,
      );
    }
  }

  async update(
    id: string,
    updateCampusRatingDto: UpdateCampusRatingDto,
  ): Promise<CampusRating> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid rating ID format');
    }

    try {
      const existingRating = await this.campusRatingModel
        .findByIdAndUpdate(id, updateCampusRatingDto, { new: true })
        .populate('campusId', 'name address')
        .exec();

      if (!existingRating) {
        throw new NotFoundException(`Campus rating with ID "${id}" not found`);
      }

      // Update campus overall rating after update
      await this.updateCampusRating(existingRating.campusId.toString());

      return existingRating;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        'Error updating campus rating: ' + error.message,
      );
    }
  }

  async remove(id: string): Promise<CampusRating> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid rating ID format');
    }

    try {
      const deletedRating = await this.campusRatingModel
        .findByIdAndDelete(id)
        .exec();

      if (!deletedRating) {
        throw new NotFoundException(`Campus rating with ID "${id}" not found`);
      }

      // Update campus overall rating after deletion
      await this.updateCampusRating(deletedRating.campusId.toString());

      return deletedRating;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        'Error deleting campus rating: ' + error.message,
      );
    }
  }

  private async updateCampusRating(campusId: string): Promise<void> {
    try {
      const campusObjectId = new Types.ObjectId(campusId);

      // Get all ratings for this campus
      const ratings = await this.campusRatingModel
        .find({ campusId: campusObjectId })
        .exec();

      const count = ratings.length;
      let overallRating = 0;

      if (count > 0) {
        // Calculate average of all rating categories
        const totalRating = ratings.reduce((sum, rating) => {
          const avgRating =
            (rating.reputation +
              rating.social +
              rating.clubs +
              rating.opportunities +
              rating.location +
              rating.happiness +
              rating.facilities +
              rating.safety +
              rating.internet +
              rating.food) /
            10;
          return sum + avgRating;
        }, 0);

        overallRating = totalRating / count;
      }

      // Update campus with new average and count
      await this.campusModel
        .findByIdAndUpdate(campusObjectId, {
          overallRating: Math.round(overallRating * 100) / 100, // Round to 2 decimal places
          count,
        })
        .exec();
    } catch (error) {
      // Log error but don't throw to avoid breaking the main operation
      console.error('Error updating campus rating:', error);
    }
  }
}
