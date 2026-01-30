import { Test, TestingModule } from '@nestjs/testing';
import { LecturerService } from './lecturer.service';
import { getModelToken } from '@nestjs/mongoose';
import { Lecturer } from '../schema/lecturer.schema';
import { Model } from 'mongoose';
import { CreateLecturerDto } from './dto/create-lecturer.dto';
import { NotFoundException } from '@nestjs/common';

const mockLecturer = {
  name: 'John Doe',
  university: 'Test University',
  department: 'Computer Science',
  courses: ['CS101', 'CS102'],
  rating: 0,
};

const mockLecturerModel = {
  new: jest.fn().mockResolvedValue(mockLecturer),
  constructor: jest.fn().mockResolvedValue(mockLecturer),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  save: jest.fn(),
  exec: jest.fn(),
  create: jest.fn(),
};

describe('LecturerService', () => {
  let service: LecturerService;
  let model: Model<Lecturer>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LecturerService,
        {
          provide: getModelToken(Lecturer.name),
          useValue: mockLecturerModel,
        },
      ],
    }).compile();

    service = module.get<LecturerService>(LecturerService);
    model = module.get<Model<Lecturer>>(getModelToken(Lecturer.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a lecturer', async () => {
      const createLecturerDto: CreateLecturerDto = {
        name: 'John Doe',
        university: 'Test University',
        department: 'Computer Science',
        courses: ['CS101'],
      };
      mockLecturerModel.create.mockResolvedValue(mockLecturer);
      const result = await service.create(createLecturerDto);
      expect(mockLecturerModel.create).toHaveBeenCalledWith(createLecturerDto);
      expect(result).toEqual(mockLecturer);
    });
  });

  describe('findAll', () => {
    it('should return an array of lecturers', async () => {
      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockLecturer]),
      } as any);
      const result = await service.findAll();
      expect(result).toEqual([mockLecturer]);
    });
  });

  describe('findOne', () => {
    it('should find and return a lecturer by ID', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockLecturer),
      } as any);
      const result = await service.findOne('someId');
      expect(result).toEqual(mockLecturer);
    });

    it('should throw NotFoundException if lecturer is not found', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);
      await expect(service.findOne('someId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update and return a lecturer', async () => {
      const updateDto = { name: 'Jane Doe' };
      const updatedLecturer = { ...mockLecturer, ...updateDto };
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedLecturer),
      } as any);
      const result = await service.update('someId', updateDto);
      expect(result).toEqual(updatedLecturer);
    });

    it('should throw NotFoundException if lecturer to update is not found', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);
      await expect(service.update('someId', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete and return a lecturer', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockLecturer),
      } as any);
      const result = await service.remove('someId');
      expect(result).toEqual(mockLecturer);
    });

    it('should throw NotFoundException if lecturer to delete is not found', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);
      await expect(service.remove('someId')).rejects.toThrow(NotFoundException);
    });
  });

  describe('addCourse', () => {
    it('should add a course to a lecturer', async () => {
      const updatedLecturer = {
        ...mockLecturer,
        courses: [...mockLecturer.courses, 'CS102'],
      };
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedLecturer),
      } as any);
      const result = await service.addCourse('someId', 'CS102');
      expect(result.courses).toContain('CS102');
    });
  });

  describe('removeCourse', () => {
    it('should remove a course from a lecturer', async () => {
      const updatedLecturer = { ...mockLecturer, courses: [] };
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedLecturer),
      } as any);
      const result = await service.removeCourse('someId', 'CS101');
      expect(result.courses).not.toContain('CS101');
    });
  });
});
