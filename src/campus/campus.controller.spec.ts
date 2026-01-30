import { Test, TestingModule } from '@nestjs/testing';
import { CampusController } from './campus.controller';
import { CampusService } from './campus.service';
import { CreateCampusDto } from './dto/create-campus.dto';
import { UpdateCampusDto } from './dto/update-campus.dto';
import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';

const mockCampus = {
  _id: 'someId',
  name: 'Test Campus',
  address: '123 Test St',
  description: 'A test campus',
  overallRating: 0,
};

const mockCampusService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('CampusController', () => {
  let controller: CampusController;

  const mockResponse = () => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    return res as Response;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CampusController],
      providers: [
        {
          provide: CampusService,
          useValue: mockCampusService,
        },
      ],
    }).compile();

    controller = module.get<CampusController>(CampusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a campus and return a success response', async () => {
      const createDto: CreateCampusDto = {
        name: 'Test Campus',
        address: '123 Test St',
      };
      mockCampusService.create.mockResolvedValue(mockCampus);
      const res = mockResponse();
      await controller.create(res, createDto);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Campus created successfully',
        data: mockCampus,
      });
    });
  });

  describe('findAll', () => {
    it('should return all campuses', async () => {
      mockCampusService.findAll.mockResolvedValue([mockCampus]);
      const res = mockResponse();
      await controller.findAll(res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Campuses retrieved successfully',
        data: [mockCampus],
      });
    });
  });

  describe('findOne', () => {
    it('should return a single campus', async () => {
      mockCampusService.findOne.mockResolvedValue(mockCampus);
      const res = mockResponse();
      await controller.findOne(res, 'someId');

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Campus retrieved successfully',
        data: mockCampus,
      });
    });
  });

  describe('update', () => {
    it('should update a campus', async () => {
      const updateDto: UpdateCampusDto = { name: 'Updated Campus' };
      const updatedCampus = { ...mockCampus, ...updateDto };
      mockCampusService.update.mockResolvedValue(updatedCampus);
      const res = mockResponse();
      await controller.update(res, 'someId', updateDto);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Campus updated successfully',
        data: updatedCampus,
      });
    });
  });

  describe('remove', () => {
    it('should remove a campus', async () => {
      mockCampusService.remove.mockResolvedValue(mockCampus);
      const res = mockResponse();
      await controller.remove(res, 'someId');

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Campus deleted successfully',
        data: mockCampus,
      });
    });
  });
});
