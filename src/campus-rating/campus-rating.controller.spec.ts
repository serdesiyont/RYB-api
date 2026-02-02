import { Test, TestingModule } from '@nestjs/testing';
import { CampusRatingController } from './campus-rating.controller';
import { CampusRatingService } from './campus-rating.service';
import { CreateCampusRatingDto } from './dto/create-campus-rating.dto';
import { UpdateCampusRatingDto } from './dto/update-campus-rating.dto';
import {
  HttpStatus,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { Types } from 'mongoose';

const mockCampusRating = {
  _id: 'someRatingId',
  userId: '507f1f77bcf86cd799439011',
  campusId: new Types.ObjectId('507f1f77bcf86cd799439012'),
  reputation: 4,
  social: 5,
  clubs: 3,
  opportunities: 4,
  location: 5,
  happiness: 4,
  facilities: 4,
  safety: 5,
  internet: 3,
  food: 4,
};

const mockCampusRatingService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  findByCampus: jest.fn(),
  findByUser: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('CampusRatingController', () => {
  let controller: CampusRatingController;

  const mockResponse = () => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    return res as Response;
  };

  const mockRequest = (userId?: string) => {
    const req: Partial<Request> & { user?: { id: string } } = {};
    if (userId) {
      req.user = { id: userId };
    }
    return req as Request;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CampusRatingController],
      providers: [
        {
          provide: CampusRatingService,
          useValue: mockCampusRatingService,
        },
      ],
    }).compile();

    controller = module.get<CampusRatingController>(CampusRatingController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a campus rating and return a success response', async () => {
      const createDto: CreateCampusRatingDto = {
        campusId: '507f1f77bcf86cd799439012',
        reputation: 4,
        social: 5,
        clubs: 3,
        opportunities: 4,
        location: 5,
        happiness: 4,
        facilities: 4,
        safety: 5,
        internet: 3,
        food: 4,
      };
      const userId = '507f1f77bcf86cd799439011';
      mockCampusRatingService.create.mockResolvedValue(mockCampusRating);
      const req = mockRequest(userId);
      const res = mockResponse();

      await controller.create(req, res, createDto);

      expect(mockCampusRatingService.create).toHaveBeenCalledWith(
        createDto,
        userId,
      );
      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Campus rating created successfully',
        data: mockCampusRating,
      });
    });

    it('should handle UnauthorizedException when user is not authenticated', async () => {
      const createDto: CreateCampusRatingDto = {
        campusId: '507f1f77bcf86cd799439012',
        reputation: 4,
        social: 5,
        clubs: 3,
        opportunities: 4,
        location: 5,
        happiness: 4,
        facilities: 4,
        safety: 5,
        internet: 3,
        food: 4,
      };
      const req = mockRequest(); // No user
      const res = mockResponse();

      await controller.create(req, res, createDto);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User must be authenticated to create a rating',
      });
    });

    it('should handle BadRequestException', async () => {
      const createDto: CreateCampusRatingDto = {
        campusId: '507f1f77bcf86cd799439012',
        reputation: 4,
        social: 5,
        clubs: 3,
        opportunities: 4,
        location: 5,
        happiness: 4,
        facilities: 4,
        safety: 5,
        internet: 3,
        food: 4,
      };
      const userId = '507f1f77bcf86cd799439011';
      mockCampusRatingService.create.mockRejectedValue(
        new BadRequestException('Invalid campus ID format'),
      );
      const req = mockRequest(userId);
      const res = mockResponse();

      await controller.create(req, res, createDto);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid campus ID format',
      });
    });

    it('should handle internal server error', async () => {
      const createDto: CreateCampusRatingDto = {
        campusId: '507f1f77bcf86cd799439012',
        reputation: 4,
        social: 5,
        clubs: 3,
        opportunities: 4,
        location: 5,
        happiness: 4,
        facilities: 4,
        safety: 5,
        internet: 3,
        food: 4,
      };
      const userId = '507f1f77bcf86cd799439011';
      mockCampusRatingService.create.mockRejectedValue(
        new Error('Database error'),
      );
      const req = mockRequest(userId);
      const res = mockResponse();

      await controller.create(req, res, createDto);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error creating campus rating',
        error: 'Database error',
      });
    });
  });

  describe('findAll', () => {
    it('should return all campus ratings', async () => {
      mockCampusRatingService.findAll.mockResolvedValue([mockCampusRating]);
      const res = mockResponse();

      await controller.findAll(res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Campus ratings retrieved successfully',
        data: [mockCampusRating],
      });
    });

    it('should handle errors', async () => {
      mockCampusRatingService.findAll.mockRejectedValue(
        new Error('Database error'),
      );
      const res = mockResponse();

      await controller.findAll(res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  describe('findOne', () => {
    it('should return a single campus rating', async () => {
      mockCampusRatingService.findOne.mockResolvedValue(mockCampusRating);
      const res = mockResponse();

      await controller.findOne(res, '507f1f77bcf86cd799439011');

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Campus rating retrieved successfully',
        data: mockCampusRating,
      });
    });

    it('should handle NotFoundException', async () => {
      mockCampusRatingService.findOne.mockRejectedValue(
        new NotFoundException('Campus rating with ID "someId" not found'),
      );
      const res = mockResponse();

      await controller.findOne(res, 'someId');

      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Campus rating with ID "someId" not found',
      });
    });

    it('should handle BadRequestException for invalid ID', async () => {
      mockCampusRatingService.findOne.mockRejectedValue(
        new BadRequestException('Invalid rating ID format'),
      );
      const res = mockResponse();

      await controller.findOne(res, 'invalidId');

      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    });
  });

  describe('findByCampus', () => {
    it('should return ratings for a specific campus', async () => {
      mockCampusRatingService.findByCampus.mockResolvedValue([
        mockCampusRating,
      ]);
      const res = mockResponse();

      await controller.findByCampus(res, '507f1f77bcf86cd799439012');

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Campus ratings retrieved successfully',
        data: [mockCampusRating],
      });
    });

    it('should handle BadRequestException', async () => {
      mockCampusRatingService.findByCampus.mockRejectedValue(
        new BadRequestException('Invalid campus ID format'),
      );
      const res = mockResponse();

      await controller.findByCampus(res, 'invalidId');

      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    });
  });

  describe('findByUser', () => {
    it('should return ratings by a specific user', async () => {
      mockCampusRatingService.findByUser.mockResolvedValue([mockCampusRating]);
      const res = mockResponse();

      await controller.findByUser(res, '507f1f77bcf86cd799439011');

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User ratings retrieved successfully',
        data: [mockCampusRating],
      });
    });

    it('should handle BadRequestException', async () => {
      mockCampusRatingService.findByUser.mockRejectedValue(
        new BadRequestException('Invalid user ID format'),
      );
      const res = mockResponse();

      await controller.findByUser(res, 'invalidId');

      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    });
  });

  describe('update', () => {
    it('should update a campus rating', async () => {
      const updateDto: UpdateCampusRatingDto = { reputation: 5 };
      const updatedRating = { ...mockCampusRating, reputation: 5 };
      mockCampusRatingService.update.mockResolvedValue(updatedRating);
      const res = mockResponse();

      await controller.update(res, '507f1f77bcf86cd799439011', updateDto);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Campus rating updated successfully',
        data: updatedRating,
      });
    });

    it('should handle NotFoundException', async () => {
      mockCampusRatingService.update.mockRejectedValue(
        new NotFoundException('Campus rating with ID "someId" not found'),
      );
      const res = mockResponse();

      await controller.update(res, 'someId', { reputation: 5 });

      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    });

    it('should handle BadRequestException', async () => {
      mockCampusRatingService.update.mockRejectedValue(
        new BadRequestException('Invalid rating ID format'),
      );
      const res = mockResponse();

      await controller.update(res, 'invalidId', { reputation: 5 });

      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    });
  });

  describe('remove', () => {
    it('should delete a campus rating', async () => {
      mockCampusRatingService.remove.mockResolvedValue(mockCampusRating);
      const res = mockResponse();

      await controller.remove(res, '507f1f77bcf86cd799439011');

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Campus rating deleted successfully',
        data: mockCampusRating,
      });
    });

    it('should handle NotFoundException', async () => {
      mockCampusRatingService.remove.mockRejectedValue(
        new NotFoundException('Campus rating with ID "someId" not found'),
      );
      const res = mockResponse();

      await controller.remove(res, 'someId');

      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    });

    it('should handle BadRequestException', async () => {
      mockCampusRatingService.remove.mockRejectedValue(
        new BadRequestException('Invalid rating ID format'),
      );
      const res = mockResponse();

      await controller.remove(res, 'invalidId');

      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    });
  });
});
