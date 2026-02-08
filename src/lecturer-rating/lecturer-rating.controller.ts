import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { LecturerRatingService } from './lecturer-rating.service';
import { CreateLecturerRatingDto } from './dto/create-lecturer-rating.dto';
import { UpdateLecturerRatingDto } from './dto/update-lecturer-rating.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user?: { id: string };
}

@ApiTags('lecturer-ratings')
@Controller('lecturer-ratings')
export class LecturerRatingController {
  constructor(private readonly lecturerRatingService: LecturerRatingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new lecturer rating' })
  @ApiResponse({
    status: 201,
    description: 'Lecturer rating created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Body() createLecturerRatingDto: CreateLecturerRatingDto,
    @Req() req: RequestWithUser,
  ) {
    const user = req.user;
    if (!user || !user.id) {
      throw new UnauthorizedException(
        'User must be authenticated to create a rating',
      );
    }
    return this.lecturerRatingService.create(createLecturerRatingDto, user.id);
  }

  @Get()
  @AllowAnonymous()
  @ApiOperation({ summary: 'Get all lecturer ratings' })
  @ApiResponse({ status: 200, description: 'Return all lecturer ratings' })
  async findAll() {
    return this.lecturerRatingService.findAll();
  }

  @Get(':id')
  @AllowAnonymous()
  @ApiOperation({ summary: 'Get a lecturer rating by ID' })
  @ApiResponse({ status: 200, description: 'Return a lecturer rating' })
  @ApiResponse({ status: 404, description: 'Lecturer rating not found' })
  async findOne(@Param('id') id: string) {
    return this.lecturerRatingService.findOne(id);
  }

  @Get('lecturer/:lecturerId')
  @AllowAnonymous()
  @ApiOperation({ summary: 'Get all ratings for a specific lecturer' })
  @ApiResponse({ status: 200, description: 'Return ratings for the lecturer' })
  async findByLecturer(@Param('lecturerId') lecturerId: string) {
    return this.lecturerRatingService.findByLecturer(lecturerId);
  }

  @Get('user/:userId')
  @AllowAnonymous()
  @ApiOperation({ summary: 'Get all ratings by a specific user' })
  @ApiResponse({ status: 200, description: 'Return ratings by the user' })
  async findByUser(@Param('userId') userId: string) {
    return this.lecturerRatingService.findByUser(userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a lecturer rating' })
  @ApiResponse({
    status: 200,
    description: 'Lecturer rating updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Lecturer rating not found' })
  async update(
    @Param('id') id: string,
    @Body() updateLecturerRatingDto: UpdateLecturerRatingDto,
  ) {
    return this.lecturerRatingService.update(id, updateLecturerRatingDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a lecturer rating' })
  @ApiResponse({
    status: 200,
    description: 'Lecturer rating deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Lecturer rating not found' })
  async remove(@Param('id') id: string) {
    return this.lecturerRatingService.remove(id);
  }
}
