import { Test, TestingModule } from '@nestjs/testing';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

// Mock the better-auth module to avoid ESM import issues in Jest
jest.mock('@thallesp/nestjs-better-auth', () => ({
  AllowAnonymous: () => jest.fn(),
}));

describe('SearchController', () => {
  let controller: SearchController;
  let service: SearchService;

  const mockSearchService = {
    search: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [
        {
          provide: SearchService,
          useValue: mockSearchService,
        },
      ],
    }).compile();

    controller = module.get<SearchController>(SearchController);
    service = module.get<SearchService>(SearchService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('search', () => {
    it('should search for campuses when only campusName is provided', async () => {
      const query = { campusName: 'Addis Ababa' };
      const result = {
        type: 'campus',
        query: 'Addis Ababa',
        results: [],
        count: 0,
      };

      mockSearchService.search.mockResolvedValue(result);

      expect(await controller.search(query)).toBe(result);
      expect(service.search).toHaveBeenCalledWith(query);
    });

    it('should search for lecturers when only lecturerName is provided', async () => {
      const query = { lecturerName: 'John' };
      const result = {
        type: 'lecturer',
        query: 'John',
        results: [],
        count: 0,
      };

      mockSearchService.search.mockResolvedValue(result);

      expect(await controller.search(query)).toBe(result);
      expect(service.search).toHaveBeenCalledWith(query);
    });

    it('should search for lecturers at campus when both parameters are provided', async () => {
      const query = {
        lecturerName: 'John',
        campusName: 'Addis Ababa University',
      };
      const result = {
        type: 'lecturer',
        query: { lecturerName: 'John', campusName: 'Addis Ababa University' },
        results: [],
        count: 0,
      };

      mockSearchService.search.mockResolvedValue(result);

      expect(await controller.search(query)).toBe(result);
      expect(service.search).toHaveBeenCalledWith(query);
    });
  });
});
