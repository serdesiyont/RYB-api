import { Test, TestingModule } from '@nestjs/testing';
import { LecturerController } from './lecturer.controller';
import { LecturerService } from './lecturer.service';
import { CreateLecturerDto } from './dto/create-lecturer.dto';
import { UpdateLecturerDto } from './dto/update-lecturer.dto';
import { CourseDto } from './dto/course.dto';
import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';

const mockLecturer = {
  _id: 'someId',
  name: 'John Doe',
  university: 'Test University',
  department: 'Computer Science',
  courses: ['CS101'],
  rating: 0,
};

const mockLecturerService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  addCourse: jest.fn(),
  removeCourse: jest.fn(),
};

describe('LecturerController', () => {
  let controller: LecturerController;
  let service: LecturerService;

  const mockResponse = () => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    return res as Response;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LecturerController],
      providers: [
        {
          provide: LecturerService,
          useValue: mockLecturerService,
        },
      ],
    }).compile();

    controller = module.get<LecturerController>(LecturerController);
    service = module.get<LecturerService>(LecturerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a lecturer and return a success response', async () => {
      const createDto: CreateLecturerDto = {
        name: 'John Doe',
        university: 'Test University',
        department: 'Computer Science',
        courses: ['CS101'],
      };
      mockLecturerService.create.mockResolvedValue(mockLecturer);
      const res = mockResponse();
      await controller.create(res, createDto);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Lecturer created successfully',
        data: mockLecturer,
      });
    });
  });

  describe('findAll', () => {
    it('should return all lecturers', async () => {
      mockLecturerService.findAll.mockResolvedValue([mockLecturer]);
      const res = mockResponse();
      await controller.findAll(res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Lecturers retrieved successfully',
        data: [mockLecturer],
      });
    });
  });

  describe('findOne', () => {
    it('should return a single lecturer', async () => {
      mockLecturerService.findOne.mockResolvedValue(mockLecturer);
      const res = mockResponse();
      await controller.findOne(res, 'someId');

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Lecturer retrieved successfully',
        data: mockLecturer,
      });
    });
  });

  describe('update', () => {
    it('should update a lecturer', async () => {
      const updateDto: UpdateLecturerDto = { name: 'Jane Doe' };
      const updatedLecturer = { ...mockLecturer, ...updateDto };
      mockLecturerService.update.mockResolvedValue(updatedLecturer);
      const res = mockResponse();
      await controller.update(res, 'someId', updateDto);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Lecturer updated successfully',
        data: updatedLecturer,
      });
    });
  });

  describe('remove', () => {
    it('should remove a lecturer', async () => {
      mockLecturerService.remove.mockResolvedValue(mockLecturer);
      const res = mockResponse();
      await controller.remove(res, 'someId');

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Lecturer deleted successfully',
        data: mockLecturer,
      });
    });
  });

  describe('addCourse', () => {
    it('should add a course to a lecturer', async () => {
      const courseDto: CourseDto = { name: 'CS102' };
      const updatedLecturer = { ...mockLecturer, courses: [...mockLecturer.courses, 'CS102'] };
      mockLecturerService.addCourse.mockResolvedValue(updatedLecturer);
      const res = mockResponse();
      await controller.addCourse(res, 'someId', courseDto);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Course added successfully',
        data: updatedLecturer,
      });
    });
  });

  describe('removeCourse', () => {
    it('should remove a course from a lecturer', async () => {
      const courseDto: CourseDto = { name: 'CS101' };
      const updatedLecturer = { ...mockLecturer, courses: [] };
      mockLecturerService.removeCourse.mockResolvedValue(updatedLecturer);
      const res = mockResponse();
      await controller.removeCourse(res, 'someId', courseDto);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Course removed successfully',
        data: updatedLecturer,
      });
    });
  });
});
