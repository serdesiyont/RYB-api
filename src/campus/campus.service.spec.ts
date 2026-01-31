import { Test, TestingModule } from '@nestjs/testing';
import { CampusService } from './campus.service';
import { getModelToken } from '@nestjs/mongoose';
import { Campus } from '../schema/campus.schema';
import { Model } from 'mongoose';
import { CreateCampusDto } from './dto/create-campus.dto';
import { NotFoundException } from '@nestjs/common';

const mockCampus = {
  name: 'Test Campus',
  address: '123 Test St',
  description: 'A test campus',
  overallRating: 0,
};

const mockCampusModel = {
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
};

describe('CampusService', () => {
  let service: CampusService;
  let model: Model<Campus>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampusService,
        {
          provide: getModelToken(Campus.name),
          useValue: mockCampusModel,
        },
      ],
    }).compile();

    service = module.get<CampusService>(CampusService);
    model = module.get<Model<Campus>>(getModelToken(Campus.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a campus', async () => {
      const createCampusDto: CreateCampusDto = {
        name: 'Test Campus',
        address: '123 Test St',
      };
      mockCampusModel.create.mockResolvedValue(mockCampus);
      const result = await service.create(createCampusDto);
      expect(mockCampusModel.create).toHaveBeenCalledWith(createCampusDto);
      expect(result).toEqual(mockCampus);
    });
  });

  describe('findAll', () => {
    it('should return an array of campuses', async () => {
      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockCampus]),
      } as any);
      const result = await service.findAll();
      expect(result).toEqual([mockCampus]);
    });
  });

  describe('findOne', () => {
    it('should find and return a campus by ID', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCampus),
      } as any);
      const result = await service.findOne('someId');
      expect(result).toEqual(mockCampus);
    });

    it('should throw NotFoundException if campus is not found', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);
      await expect(service.findOne('someId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update and return a campus', async () => {
      const updateDto = { name: 'Updated Campus' };
      const updatedCampus = { ...mockCampus, ...updateDto };
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedCampus),
      } as any);
      const result = await service.update('someId', updateDto);
      expect(result).toEqual(updatedCampus);
    });

    it('should throw NotFoundException if campus to update is not found', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);
      await expect(service.update('someId', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete and return a campus', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCampus),
      } as any);
      const result = await service.remove('someId');
      expect(result).toEqual(mockCampus);
    });

    it('should throw NotFoundException if campus to delete is not found', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);
      await expect(service.remove('someId')).rejects.toThrow(NotFoundException);
    });
  });
});
