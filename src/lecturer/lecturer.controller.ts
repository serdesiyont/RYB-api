import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LecturerService } from './lecturer.service';
import { CreateLecturerDto } from './dto/create-lecturer.dto';
import { UpdateLecturerDto } from './dto/update-lecturer.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CourseDto } from './dto/course.dto';

@ApiTags('lecturer')
@Controller('lecturer')
export class LecturerController {
  constructor(private readonly lecturerService: LecturerService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new lecturer' })
  create(@Body() createLecturerDto: CreateLecturerDto) {
    return this.lecturerService.create(createLecturerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all lecturers' })
  findAll() {
    return this.lecturerService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a lecturer by ID' })
  findOne(@Param('id') id: string) {
    return this.lecturerService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a lecturer' })
  update(
    @Param('id') id: string,
    @Body() updateLecturerDto: UpdateLecturerDto,
  ) {
    return this.lecturerService.update(id, updateLecturerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a lecturer' })
  remove(@Param('id') id: string) {
    return this.lecturerService.remove(id);
  }

  @Post(':id/courses')
  @ApiOperation({ summary: 'Add a course to a lecturer' })
  addCourse(@Param('id') id: string, @Body() courseDto: CourseDto) {
    return this.lecturerService.addCourse(id, courseDto.name);
  }

  @Delete(':id/courses')
  @ApiOperation({ summary: 'Remove a course from a lecturer' })
  removeCourse(@Param('id') id: string, @Body() courseDto: CourseDto) {
    return this.lecturerService.removeCourse(id, courseDto.name);
  }
}
