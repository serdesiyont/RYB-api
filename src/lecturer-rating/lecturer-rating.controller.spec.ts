import { Test, TestingModule } from '@nestjs/testing';
import { LecturerRatingController } from './lecturer-rating.controller';
import { LecturerRatingService } from './lecturer-rating.service';
import { CreateLecturerRatingDto } from './dto/create-lecturer-rating.dto';
import { UpdateLecturerRatingDto } from './dto/update-lecturer-rating.dto';
import { UnauthorizedException } from '@nestjs/common';
import { Types } from 'mongoose';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user?: { id: string };
}

const mockLecturerRating = {
  _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
  userId: '507f1f77bcf86cd799439011',
  lecturerId: new Types.ObjectId('507f1f77bcf86cd799439012'),
  course: 'Introduction to Computer Science',
  difficulty: 3,
  quality: 4,
  creditHr: 3,
  grade: 'A',
  textbook: true,
  comment: 'Great lecturer!',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockLecturerRatingService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  findByLecturer: jest.fn(),
  findByUser: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('LecturerRatingController', () => {
  let controller: LecturerRatingController;
  let service: LecturerRatingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LecturerRatingController],
      providers: [
        {
          provide: LecturerRatingService,
          useValue: mockLecturerRatingService,
        },
      ],
    }).compile();

    controller = module.get<LecturerRatingController>(LecturerRatingController);
    service = module.get<LecturerRatingService>(LecturerRatingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a lecturer rating', async () => {
      const createDto: CreateLecturerRatingDto = {
        lecturerId: '507f1f77bcf86cd799439012',
        course: 'Introduction to Computer Science',
        difficulty: 3,
        quality: 4,
        creditHr: 3,
        grade: 'A',
        textbook: true,
        comment: 'Great lecturer!',
      };

      const mockRequest = {
        user: { id: '507f1f77bcf86cd799439011' },
      } as RequestWithUser;

      mockLecturerRatingService.create.mockResolvedValue(mockLecturerRating);

      const result = await controller.create(createDto, mockRequest);

      expect(service.create).toHaveBeenCalledWith(
        createDto,
        '507f1f77bcf86cd799439011',
      );
      expect(result).toEqual(mockLecturerRating);
    });

    it('should throw UnauthorizedException if user is not authenticated', async () => {
      const createDto: CreateLecturerRatingDto = {
        lecturerId: '507f1f77bcf86cd799439012',
        course: 'Introduction to Computer Science',
        difficulty: 3,
        quality: 4,
        creditHr: 3,
        grade: 'A',
        textbook: true,
      };

      const mockRequest = {} as RequestWithUser;

      await expect(controller.create(createDto, mockRequest)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if user has no id', async () => {
      const createDto: CreateLecturerRatingDto = {
        lecturerId: '507f1f77bcf86cd799439012',
        course: 'Introduction to Computer Science',
        difficulty: 3,
        quality: 4,
        creditHr: 3,
        grade: 'A',
        textbook: true,
      };

      const mockRequest = {
        user: {},
      } as RequestWithUser;

      await expect(controller.create(createDto, mockRequest)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of lecturer ratings', async () => {
      const mockRatings = [mockLecturerRating];
      mockLecturerRatingService.findAll.mockResolvedValue(mockRatings);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockRatings);
    });
  });

  describe('findOne', () => {
    it('should return a single lecturer rating', async () => {
      mockLecturerRatingService.findOne.mockResolvedValue(mockLecturerRating);

      const result = await controller.findOne('507f1f77bcf86cd799439011');

      expect(service.findOne).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(result).toEqual(mockLecturerRating);
    });
  });

  describe('findByLecturer', () => {
    it('should return ratings for a specific lecturer', async () => {
      const mockRatings = [mockLecturerRating];
      mockLecturerRatingService.findByLecturer.mockResolvedValue(mockRatings);

      const result = await controller.findByLecturer(
        '507f1f77bcf86cd799439012',
      );

      expect(service.findByLecturer).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439012',
      );
      expect(result).toEqual(mockRatings);
    });
  });

  describe('findByUser', () => {
    it('should return ratings by a specific user', async () => {
      const mockRatings = [mockLecturerRating];
      mockLecturerRatingService.findByUser.mockResolvedValue(mockRatings);

      const result = await controller.findByUser('507f1f77bcf86cd799439011');

      expect(service.findByUser).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
      );
      expect(result).toEqual(mockRatings);
    });
  });

  describe('update', () => {
    it('should update a lecturer rating', async () => {
      const updateDto: UpdateLecturerRatingDto = {
        difficulty: 4,
        quality: 5,
      };

      const updatedRating = {
        ...mockLecturerRating,
        ...updateDto,
      };

      mockLecturerRatingService.update.mockResolvedValue(updatedRating);

      const result = await controller.update(
        '507f1f77bcf86cd799439011',
        updateDto,
      );

      expect(service.update).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        updateDto,
      );
      expect(result).toEqual(updatedRating);
    });
  });

  describe('remove', () => {
    it('should remove a lecturer rating', async () => {
      mockLecturerRatingService.remove.mockResolvedValue(mockLecturerRating);

      const result = await controller.remove('507f1f77bcf86cd799439011');

      expect(service.remove).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(result).toEqual(mockLecturerRating);
    });
  });
});
