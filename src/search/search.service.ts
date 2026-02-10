import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lecturer, LecturerDocument } from '../schema/lecturer.schema';
import { Campus, CampusDocument } from '../schema/campus.schema';
import { SearchQueryDto } from './dto/search-query.dto';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(Lecturer.name)
    private lecturerModel: Model<LecturerDocument>,
    @InjectModel(Campus.name)
    private campusModel: Model<CampusDocument>,
  ) {}

  async search(searchQueryDto: SearchQueryDto) {
    const { lecturerName, campusName } = searchQueryDto;

    // Validate that at least one parameter is provided
    if (!lecturerName && !campusName) {
      throw new BadRequestException(
        'At least one search parameter (lecturerName or campusName) is required',
      );
    }

    // Case 1: Only campus name provided - search campuses
    if (campusName && !lecturerName) {
      return this.searchCampuses(campusName);
    }

    // Case 2: Only lecturer name provided - search lecturers
    if (lecturerName && !campusName) {
      return this.searchLecturers(lecturerName);
    }

    // Case 3: Both provided - search lecturers at specific campus
    return this.searchLecturersAtCampus(lecturerName!, campusName!);
  }

  private async searchCampuses(campusName: string) {
    try {
      // Use MongoDB Atlas Search if available, otherwise fall back to regex
      const results = await this.campusModel
        .aggregate([
          {
            $search: {
              index: 'campus_search',
              text: {
                query: campusName,
                path: ['name', 'address', 'description'],
                fuzzy: {
                  maxEdits: 2,
                },
              },
            },
          },
          {
            $limit: 20,
          },
          {
            $project: {
              _id: 1,
              name: 1,
            },
          },
        ])
        .exec();

      return {
        type: 'campus',
        query: campusName,
        results,
        count: results.length,
      };
    } catch {
      // Fallback to regex search if Atlas Search is not configured
      const results = await this.campusModel
        .find({
          $or: [
            { name: { $regex: campusName, $options: 'i' } },
            { address: { $regex: campusName, $options: 'i' } },
            { description: { $regex: campusName, $options: 'i' } },
          ],
        })
        .select('_id name')
        .limit(20)
        .exec();

      return {
        type: 'campus',
        query: campusName,
        results,
        count: results.length,
      };
    }
  }

  private async searchLecturers(lecturerName: string) {
    try {
      // Use MongoDB Atlas Search if available
      const results = await this.lecturerModel
        .aggregate([
          {
            $search: {
              index: 'lecturer_search',
              text: {
                query: lecturerName,
                path: ['name', 'university', 'department', 'courses'],
                fuzzy: {
                  maxEdits: 2,
                },
              },
            },
          },
          {
            $limit: 20,
          },
          {
            $project: {
              _id: 1,
              name: 1,
            },
          },
        ])
        .exec();

      return {
        type: 'lecturer',
        query: lecturerName,
        results,
        count: results.length,
      };
    } catch {
      // Fallback to regex search
      const results = await this.lecturerModel
        .find({
          $or: [
            { name: { $regex: lecturerName, $options: 'i' } },
            { department: { $regex: lecturerName, $options: 'i' } },
            { courses: { $regex: lecturerName, $options: 'i' } },
          ],
        })
        .select('_id name')
        .limit(20)
        .exec();

      return {
        type: 'lecturer',
        query: lecturerName,
        results,
        count: results.length,
      };
    }
  }

  private async searchLecturersAtCampus(
    lecturerName: string,
    campusName: string,
  ) {
    try {
      // Use MongoDB Atlas Search with compound query
      const results = await this.lecturerModel
        .aggregate([
          {
            $search: {
              index: 'lecturer_search',
              compound: {
                must: [
                  {
                    text: {
                      query: lecturerName,
                      path: ['name', 'department', 'courses'],
                      fuzzy: {
                        maxEdits: 2,
                      },
                    },
                  },
                ],
                should: [
                  {
                    text: {
                      query: campusName,
                      path: 'university',
                      fuzzy: {
                        maxEdits: 1,
                      },
                    },
                  },
                ],
              },
            },
          },
          {
            $match: {
              university: { $regex: campusName, $options: 'i' },
            },
          },
          {
            $limit: 20,
          },
          {
            $project: {
              _id: 1,
              name: 1,
            },
          },
        ])
        .exec();

      return {
        type: 'lecturer',
        query: { lecturerName, campusName },
        results,
        count: results.length,
      };
    } catch {
      // Fallback to regex search with campus filter
      const results = await this.lecturerModel
        .find({
          university: { $regex: campusName, $options: 'i' },
          $or: [
            { name: { $regex: lecturerName, $options: 'i' } },
            { department: { $regex: lecturerName, $options: 'i' } },
            { courses: { $regex: lecturerName, $options: 'i' } },
          ],
        })
        .select('_id name')
        .limit(20)
        .exec();

      return {
        type: 'lecturer',
        query: { lecturerName, campusName },
        results,
        count: results.length,
      };
    }
  }
}
