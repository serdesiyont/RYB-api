import { Test, TestingModule } from '@nestjs/testing';
import { LecturerRatingService } from './lecturer-rating.service';
import { getModelToken } from '@nestjs/mongoose';
import { LecturerRating } from '../schema/lecturer-rating.schema';
import { Lecturer } from '../schema/lecturer.schema';
import { Model, Types } from 'mongoose';
import { CreateLecturerRatingDto } from './dto/create-lecturer-rating.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

const mockLecturerRating = {
  _id: 'someRatingId',
  userId: '507f1f77bcf86cd799439011',
  lecturerId: new Types.ObjectId('507f1f77bcf86cd799439012'),
  course: 'Introduction to Computer Science',
  difficulty: 3,
  quality: 4,
  creditHr: 3,
  grade: 'A',
  textbook: true,
  comment: 'Great lecturer!',
};

const mockLecturerRatingModel = {
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
};

const mockLecturerModel = {
  findByIdAndUpdate: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue({}),
  }),
};

describe('LecturerRatingService', () => {
  let service: LecturerRatingService;
  let model: Model<LecturerRating>;
  let lecturerModel: Model<Lecturer>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LecturerRatingService,
        {
          provide: getModelToken(LecturerRating.name),
          useValue: mockLecturerRatingModel,
        },
        {
          provide: getModelToken(Lecturer.name),
          useValue: mockLecturerModel,
        },
      ],
    }).compile();

    service = module.get<LecturerRatingService>(LecturerRatingService);
    model = module.get<Model<LecturerRating>>(getModelToken(LecturerRating.name));
    lecturerModel = module.get<Model<Lecturer>>(getModelToken(Lecturer.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a lecturer rating', async () => {
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
      const userId = '507f1f77bcf86cd799439011';
      mockLecturerRatingModel.create.mockResolvedValue(mockLecturerRating);
      mockLecturerRatingModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockLecturerRating]),
      } as any);
      mockLecturerModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue({}),
      } as any);

      const result = await service.create(createDto, userId);

      expect(mockLecturerRatingModel.create).toHaveBeenCalledWith({
        ...createDto,
        lecturerId: expect.any(Types.ObjectId),
        userId,
      });
      expect(result).toEqual(mockLecturerRating);
    });

    it('should throw BadRequestException for invalid lecturer ID', async () => {
      const createDto: CreateLecturerRatingDto = {
        lecturerId: 'invalidId',
        course: 'Introduction to Computer Science',
        difficulty: 3,
        quality: 4,
        creditHr: 3,
        grade: 'A',
        textbook: true,
      };
      const userId = '507f1f77bcf86cd799439011';

      await expect(service.create(createDto, userId)).rejects.toThrow(BadRequestException);
      await expect(service.create(createDto, userId)).rejects.toThrow('Invalid lecturer ID format');
    });
  });

  describe('findAll', () => {
    it('should return an array of lecturer ratings', async () => {
      const mockExec = jest.fn().mockResolvedValue([mockLecturerRating]);
      const mockPopulate = jest.fn().mockReturnValue({ exec: mockExec });

      jest.spyOn(model, 'find').mockReturnValue({
        populate: mockPopulate,
      } as any);

      const result = await service.findAll();

      expect(result).toEqual([mockLecturerRating]);
      expect(model.find).toHaveBeenCalled();
    });

    it('should throw BadRequestException on error', async () => {
      jest.spyOn(model, 'find').mockImplementation(() => {
        throw new Error('Database error');
      });

      await expect(service.findAll()).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('should find and return a lecturer rating by ID', async () => {
      const mockExec = jest.fn().mockResolvedValue(mockLecturerRating);
      const mockPopulate = jest.fn().mockReturnValue({ exec: mockExec });

      jest.spyOn(model, 'findById').mockReturnValue({
        populate: mockPopulate,
      } as any);

      const result = await service.findOne('507f1f77bcf86cd799439011');

      expect(result).toEqual(mockLecturerRating);
    });

    it('should throw NotFoundException if rating is not found', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);
      const mockPopulate = jest.fn().mockReturnValue({ exec: mockExec });

      jest.spyOn(model, 'findById').mockReturnValue({
        populate: mockPopulate,
      } as any);

      await expect(service.findOne('507f1f77bcf86cd799439011')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException for invalid ID format', async () => {
      await expect(service.findOne('invalidId')).rejects.toThrow(BadRequestException);
      await expect(service.findOne('invalidId')).rejects.toThrow('Invalid rating ID format');
    });
  });

  describe('findByLecturer', () => {
    it('should return ratings for a specific lecturer', async () => {
      const mockExec = jest.fn().mockResolvedValue([mockLecturerRating]);

      jest.spyOn(model, 'find').mockReturnValue({
        exec: mockExec,
      } as any);

      const result = await service.findByLecturer('507f1f77bcf86cd799439012');

      expect(result).toEqual([mockLecturerRating]);
      expect(model.find).toHaveBeenCalledWith({ lecturerId: expect.any(Types.ObjectId) });
    });

    it('should throw BadRequestException for invalid lecturer ID', async () => {
      await expect(service.findByLecturer('invalidId')).rejects.toThrow(BadRequestException);
    });
  });

  describe('findByUser', () => {
    it('should return ratings by a specific user', async () => {
      const mockExec = jest.fn().mockResolvedValue([mockLecturerRating]);
      const mockPopulate = jest.fn().mockReturnValue({ exec: mockExec });

      jest.spyOn(model, 'find').mockReturnValue({
        populate: mockPopulate,
      } as any);

      const result = await service.findByUser('507f1f77bcf86cd799439011');

      expect(result).toEqual([mockLecturerRating]);
      expect(model.find).toHaveBeenCalledWith({ userId: '507f1f77bcf86cd799439011' });
    });
  });

  describe('update', () => {
    it('should update and return a lecturer rating', async () => {
      const updateDto = { difficulty: 4, quality: 5 };
      const updatedRating = { ...mockLecturerRating, ...updateDto };

      const mockExec = jest.fn().mockResolvedValue(updatedRating);
      const mockPopulate = jest.fn().mockReturnValue({ exec: mockExec });

      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        populate: mockPopulate,
      } as any);

      mockLecturerRatingModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([updatedRating]),
      } as any);
      mockLecturerModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue({}),
      } as any);

      const result = await service.update('507f1f77bcf86cd799439011', updateDto);

      expect(result).toEqual(updatedRating);
    });

    it('should throw NotFoundException if rating to update is not found', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);
      const mockPopulate = jest.fn().mockReturnValue({ exec: mockExec });

      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        populate: mockPopulate,
      } as any);

      await expect(
        service.update('507f1f77bcf86cd799439011', { difficulty: 4 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for invalid ID format', async () => {
      await expect(service.update('invalidId', { difficulty: 4 })).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('remove', () => {
    it('should delete and return a lecturer rating', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockLecturerRating),
      } as any);

      mockLecturerRatingModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      } as any);
      mockLecturerModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue({}),
      } as any);

      const result = await service.remove('507f1f77bcf86cd799439011');

      expect(result).toEqual(mockLecturerRating);
    });

    it('should throw NotFoundException if rating to delete is not found', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.remove('507f1f77bcf86cd799439011')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException for invalid ID format', async () => {
      await expect(service.remove('invalidId')).rejects.toThrow(BadRequestException);
    });
  });
});
