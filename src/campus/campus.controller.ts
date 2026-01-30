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
import { CampusService } from './campus.service';
import { CreateCampusDto } from './dto/create-campus.dto';
import { UpdateCampusDto } from './dto/update-campus.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('campus')
@Controller('campus')
export class CampusController {
  constructor(private readonly campusService: CampusService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new campus' })
  async create(@Res() res: Response, @Body() createCampusDto: CreateCampusDto) {
    try {
      const campus = await this.campusService.create(createCampusDto);
      return res.status(HttpStatus.CREATED).json({
        message: 'Campus created successfully',
        data: campus,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error creating campus',
        error: error.message,
      });
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all campuses' })
  async findAll(@Res() res: Response) {
    try {
      const campuses = await this.campusService.findAll();
      return res.status(HttpStatus.OK).json({
        message: 'Campuses retrieved successfully',
        data: campuses,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error retrieving campuses',
        error: error.message,
      });
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a campus by ID' })
  async findOne(@Res() res: Response, @Param('id') id: string) {
    try {
      const campus = await this.campusService.findOne(id);
      return res.status(HttpStatus.OK).json({
        message: 'Campus retrieved successfully',
        data: campus,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: error.message,
        });
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error retrieving campus',
        error: error.message,
      });
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a campus' })
  async update(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() updateCampusDto: UpdateCampusDto,
  ) {
    try {
      const campus = await this.campusService.update(id, updateCampusDto);
      return res.status(HttpStatus.OK).json({
        message: 'Campus updated successfully',
        data: campus,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: error.message,
        });
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error updating campus',
        error: error.message,
      });
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a campus' })
  async remove(@Res() res: Response, @Param('id') id: string) {
    try {
      const campus = await this.campusService.remove(id);
      return res.status(HttpStatus.OK).json({
        message: 'Campus deleted successfully',
        data: campus,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: error.message,
        });
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error deleting campus',
        error: error.message,
      });
    }
  }
}
