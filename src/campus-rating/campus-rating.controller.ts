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
  BadRequestException,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { CampusRatingService } from './campus-rating.service';
import { CreateCampusRatingDto } from './dto/create-campus-rating.dto';
import { UpdateCampusRatingDto } from './dto/update-campus-rating.dto';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { Response, Request } from 'express';

interface RequestWithUser extends Request {
  user?: { id: string };
}

@ApiTags('campus-rating')
@Controller('campus-rating')
export class CampusRatingController {
  constructor(private readonly campusRatingService: CampusRatingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new campus rating' })
  async create(
    @Req() req: RequestWithUser,
    @Res() res: Response,
    @Body() createCampusRatingDto: CreateCampusRatingDto,
  ) {
    try {
      // Get user from better-auth session
      const user = req.user;
      if (!user || !user.id) {
        throw new UnauthorizedException(
          'User must be authenticated to create a rating',
        );
      }

      const rating = await this.campusRatingService.create(
        createCampusRatingDto,
        user.id,
      );
      return res.status(HttpStatus.CREATED).json({
        message: 'Campus rating created successfully',
        data: rating,
      });
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: error.message,
        });
      }
      if (error instanceof BadRequestException) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: error.message,
        });
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error creating campus rating',
        error: error.message,
      });
    }
  }

  @Get()
  @AllowAnonymous()
  @ApiOperation({ summary: 'Get all campus ratings' })
  async findAll(@Res() res: Response) {
    try {
      const ratings = await this.campusRatingService.findAll();
      return res.status(HttpStatus.OK).json({
        message: 'Campus ratings retrieved successfully',
        data: ratings,
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: error.message,
        });
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error retrieving campus ratings',
        error: error.message,
      });
    }
  }

  @Get(':id')
  @AllowAnonymous()
  @ApiOperation({ summary: 'Get a campus rating by ID' })
  @ApiParam({ name: 'id', description: 'Campus rating ID' })
  async findOne(@Res() res: Response, @Param('id') id: string) {
    try {
      const rating = await this.campusRatingService.findOne(id);
      return res.status(HttpStatus.OK).json({
        message: 'Campus rating retrieved successfully',
        data: rating,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: error.message,
        });
      }
      if (error instanceof BadRequestException) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: error.message,
        });
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error retrieving campus rating',
        error: error.message,
      });
    }
  }

  @Get('campus/:campusId')
  @AllowAnonymous()
  @ApiOperation({ summary: 'Get all ratings for a specific campus' })
  @ApiParam({ name: 'campusId', description: 'Campus ID' })
  async findByCampus(
    @Res() res: Response,
    @Param('campusId') campusId: string,
  ) {
    try {
      const ratings = await this.campusRatingService.findByCampus(campusId);
      return res.status(HttpStatus.OK).json({
        message: 'Campus ratings retrieved successfully',
        data: ratings,
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: error.message,
        });
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error retrieving campus ratings',
        error: error.message,
      });
    }
  }

  @Get('user/:userId')
  @AllowAnonymous()
  @ApiOperation({ summary: 'Get all ratings by a specific user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  async findByUser(@Res() res: Response, @Param('userId') userId: string) {
    try {
      const ratings = await this.campusRatingService.findByUser(userId);
      return res.status(HttpStatus.OK).json({
        message: 'User ratings retrieved successfully',
        data: ratings,
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: error.message,
        });
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error retrieving user ratings',
        error: error.message,
      });
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a campus rating' })
  @ApiParam({ name: 'id', description: 'Campus rating ID' })
  async update(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() updateCampusRatingDto: UpdateCampusRatingDto,
  ) {
    try {
      const rating = await this.campusRatingService.update(
        id,
        updateCampusRatingDto,
      );
      return res.status(HttpStatus.OK).json({
        message: 'Campus rating updated successfully',
        data: rating,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: error.message,
        });
      }
      if (error instanceof BadRequestException) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: error.message,
        });
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error updating campus rating',
        error: error.message,
      });
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a campus rating' })
  @ApiParam({ name: 'id', description: 'Campus rating ID' })
  async remove(@Res() res: Response, @Param('id') id: string) {
    try {
      const rating = await this.campusRatingService.remove(id);
      return res.status(HttpStatus.OK).json({
        message: 'Campus rating deleted successfully',
        data: rating,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: error.message,
        });
      }
      if (error instanceof BadRequestException) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: error.message,
        });
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error deleting campus rating',
        error: error.message,
      });
    }
  }
}
