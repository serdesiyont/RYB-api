import { Test, TestingModule } from '@nestjs/testing';
import { CampusRatingService } from './campus-rating.service';
import { getModelToken } from '@nestjs/mongoose';
import { CampusRating } from '../schema/campus-rating.schema';
import { Campus } from '../schema/campus.schema';
import { Model, Types } from 'mongoose';
import { CreateCampusRatingDto } from './dto/create-campus-rating.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

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

const mockCampusRatingModel = {
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
};

const mockCampusModel = {
  findByIdAndUpdate: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue({}),
  }),
};

describe('CampusRatingService', () => {
  let service: CampusRatingService;
  let model: Model<CampusRating>;
  let campusModel: Model<Campus>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampusRatingService,
        {
          provide: getModelToken(CampusRating.name),
          useValue: mockCampusRatingModel,
        },
        {
          provide: getModelToken(Campus.name),
          useValue: mockCampusModel,
        },
      ],
    }).compile();

    service = module.get<CampusRatingService>(CampusRatingService);
    model = module.get<Model<CampusRating>>(getModelToken(CampusRating.name));
    campusModel = module.get<Model<Campus>>(getModelToken(Campus.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a campus rating', async () => {
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
      mockCampusRatingModel.create.mockResolvedValue(mockCampusRating);
      mockCampusRatingModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockCampusRating]),
      } as any);
      mockCampusModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue({}),
      } as any);

      const result = await service.create(createDto, userId);

      expect(mockCampusRatingModel.create).toHaveBeenCalledWith({
        ...createDto,
        campusId: expect.any(Types.ObjectId),
        userId,
      });
      expect(result).toEqual(mockCampusRating);
    });

    it('should throw BadRequestException for invalid campus ID', async () => {
      const createDto: CreateCampusRatingDto = {
        campusId: 'invalidId',
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

      await expect(service.create(createDto, userId)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(createDto, userId)).rejects.toThrow(
        'Invalid campus ID format',
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of campus ratings', async () => {
      const mockExec = jest.fn().mockResolvedValue([mockCampusRating]);
      const mockPopulate = jest.fn().mockReturnValue({ exec: mockExec });

      jest.spyOn(model, 'find').mockReturnValue({
        populate: mockPopulate,
      } as any);

      const result = await service.findAll();

      expect(result).toEqual([mockCampusRating]);
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
    it('should find and return a campus rating by ID', async () => {
      const mockExec = jest.fn().mockResolvedValue(mockCampusRating);
      const mockPopulate = jest.fn().mockReturnValue({ exec: mockExec });

      jest.spyOn(model, 'findById').mockReturnValue({
        populate: mockPopulate,
      } as any);

      const result = await service.findOne('507f1f77bcf86cd799439011');

      expect(result).toEqual(mockCampusRating);
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
      await expect(service.findOne('invalidId')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.findOne('invalidId')).rejects.toThrow(
        'Invalid rating ID format',
      );
    });
  });

  describe('findByCampus', () => {
    it('should return ratings for a specific campus', async () => {
      const mockExec = jest.fn().mockResolvedValue([mockCampusRating]);

      jest.spyOn(model, 'find').mockReturnValue({
        exec: mockExec,
      } as any);

      const result = await service.findByCampus('507f1f77bcf86cd799439012');

      expect(result).toEqual([mockCampusRating]);
      expect(model.find).toHaveBeenCalledWith({
        campusId: expect.any(Types.ObjectId),
      });
    });

    it('should throw BadRequestException for invalid campus ID', async () => {
      await expect(service.findByCampus('invalidId')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findByUser', () => {
    it('should return ratings by a specific user', async () => {
      const mockExec = jest.fn().mockResolvedValue([mockCampusRating]);
      const mockPopulate = jest.fn().mockReturnValue({ exec: mockExec });

      jest.spyOn(model, 'find').mockReturnValue({
        populate: mockPopulate,
      } as any);

      const result = await service.findByUser('507f1f77bcf86cd799439011');

      expect(result).toEqual([mockCampusRating]);
      expect(model.find).toHaveBeenCalledWith({
        userId: '507f1f77bcf86cd799439011',
      });
    });
  });

  describe('update', () => {
    it('should update and return a campus rating', async () => {
      const updateDto = { reputation: 5, social: 4 };
      const updatedRating = { ...mockCampusRating, ...updateDto };

      const mockExec = jest.fn().mockResolvedValue(updatedRating);
      const mockPopulate = jest.fn().mockReturnValue({ exec: mockExec });

      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        populate: mockPopulate,
      } as any);

      mockCampusRatingModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([updatedRating]),
      } as any);
      mockCampusModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue({}),
      } as any);

      const result = await service.update(
        '507f1f77bcf86cd799439011',
        updateDto,
      );

      expect(result).toEqual(updatedRating);
    });

    it('should throw NotFoundException if rating to update is not found', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);
      const mockPopulate = jest.fn().mockReturnValue({ exec: mockExec });

      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        populate: mockPopulate,
      } as any);

      await expect(
        service.update('507f1f77bcf86cd799439011', { reputation: 5 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for invalid ID format', async () => {
      await expect(
        service.update('invalidId', { reputation: 5 }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should delete and return a campus rating', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCampusRating),
      } as any);

      mockCampusRatingModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      } as any);
      mockCampusModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue({}),
      } as any);

      const result = await service.remove('507f1f77bcf86cd799439011');

      expect(result).toEqual(mockCampusRating);
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
      await expect(service.remove('invalidId')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
