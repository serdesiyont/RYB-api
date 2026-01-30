import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { LecturerService } from './lecturer.service';
import { CreateLecturerDto } from './dto/create-lecturer.dto';
import { UpdateLecturerDto } from './dto/update-lecturer.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CourseDto } from './dto/course.dto';
import { Response } from 'express';

@ApiTags('lecturer')
@Controller('lecturer')
export class LecturerController {
  constructor(private readonly lecturerService: LecturerService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new lecturer' })
  async create(
    @Res() res: Response,
    @Body() createLecturerDto: CreateLecturerDto,
  ) {
    try {
      const lecturer = await this.lecturerService.create(createLecturerDto);
      return res.status(HttpStatus.CREATED).json({
        message: 'Lecturer created successfully',
        data: lecturer,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error creating lecturer',
        error: error.message,
      });
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all lecturers' })
  async findAll(@Res() res: Response) {
    try {
      const lecturers = await this.lecturerService.findAll();
      return res.status(HttpStatus.OK).json({
        message: 'Lecturers retrieved successfully',
        data: lecturers,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error retrieving lecturers',
        error: error.message,
      });
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a lecturer by ID' })
  async findOne(@Res() res: Response, @Param('id') id: string) {
    try {
      const lecturer = await this.lecturerService.findOne(id);
      return res.status(HttpStatus.OK).json({
        message: 'Lecturer retrieved successfully',
        data: lecturer,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: error.message,
        });
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error retrieving lecturer',
        error: error.message,
      });
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a lecturer' })
  async update(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() updateLecturerDto: UpdateLecturerDto,
  ) {
    try {
      const lecturer = await this.lecturerService.update(id, updateLecturerDto);
      return res.status(HttpStatus.OK).json({
        message: 'Lecturer updated successfully',
        data: lecturer,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: error.message,
        });
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error updating lecturer',
        error: error.message,
      });
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a lecturer' })
  async remove(@Res() res: Response, @Param('id') id: string) {
    try {
      const lecturer = await this.lecturerService.remove(id);
      return res.status(HttpStatus.OK).json({
        message: 'Lecturer deleted successfully',
        data: lecturer,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: error.message,
        });
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error deleting lecturer',
        error: error.message,
      });
    }
  }

  @Post(':id/courses')
  @ApiOperation({ summary: 'Add a course to a lecturer' })
  async addCourse(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() courseDto: CourseDto,
  ) {
    try {
      const lecturer = await this.lecturerService.addCourse(id, courseDto.name);
      return res.status(HttpStatus.OK).json({
        message: 'Course added successfully',
        data: lecturer,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: error.message,
        });
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error adding course',
        error: error.message,
      });
    }
  }

  @Delete(':id/courses')
  @ApiOperation({ summary: 'Remove a course from a lecturer' })
  async removeCourse(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() courseDto: CourseDto,
  ) {
    try {
      const lecturer = await this.lecturerService.removeCourse(
        id,
        courseDto.name,
      );
      return res.status(HttpStatus.OK).json({
        message: 'Course removed successfully',
        data: lecturer,
      });
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: error.message,
        });
      }
      const message = error instanceof Error ? error.message : String(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error removing course',
        error: message,
      });
    }
  }
}
