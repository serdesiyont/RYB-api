import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException } from '@nestjs/common';
import { SearchService } from './search.service';
import { Lecturer } from '../schema/lecturer.schema';
import { Campus } from '../schema/campus.schema';

describe('SearchService', () => {
  let service: SearchService;

  const mockLecturerModel = {
    aggregate: jest.fn(),
    find: jest.fn(),
  };

  const mockCampusModel = {
    aggregate: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        {
          provide: getModelToken(Lecturer.name),
          useValue: mockLecturerModel,
        },
        {
          provide: getModelToken(Campus.name),
          useValue: mockCampusModel,
        },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('search', () => {
    it('should throw BadRequestException when no parameters provided', async () => {
      await expect(service.search({})).rejects.toThrow(BadRequestException);
    });

    it('should search campuses when only campusName is provided', async () => {
      const mockResults = [{ name: 'Addis Ababa University' }];
      mockCampusModel.aggregate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockResults),
      });

      const result = await service.search({ campusName: 'Addis Ababa' });

      expect(result.type).toBe('campus');
      expect(result.query).toBe('Addis Ababa');
      expect(result.count).toBe(1);
    });

    it('should search lecturers when only lecturerName is provided', async () => {
      const mockResults = [{ name: 'John Doe' }];
      mockLecturerModel.aggregate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockResults),
      });

      const result = await service.search({ lecturerName: 'John' });

      expect(result.type).toBe('lecturer');
      expect(result.query).toBe('John');
      expect(result.count).toBe(1);
    });

    it('should search lecturers at campus when both parameters provided', async () => {
      const mockResults = [{ name: 'John Doe', university: 'AAU' }];
      mockLecturerModel.aggregate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockResults),
      });

      const result = await service.search({
        lecturerName: 'John',
        campusName: 'AAU',
      });

      expect(result.type).toBe('lecturer');
      expect(result.count).toBe(1);
    });
  });
});
