import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { SearchService } from './search.service';
import { SearchQueryDto } from './dto/search-query.dto';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @AllowAnonymous()
  @ApiOperation({
    summary: 'Search for lecturers and campuses',
    description: `
      Efficient search using MongoDB Atlas Search.
      - If only lecturerName is provided: searches lecturers
      - If only campusName is provided: searches campuses
      - If both are provided: searches lecturers at the specified campus
    `,
  })
  @ApiQuery({
    name: 'lecturerName',
    required: false,
    description: 'Name of the lecturer to search for',
  })
  @ApiQuery({
    name: 'campusName',
    required: false,
    description: 'Name of the campus/university to search for',
  })
  @ApiResponse({
    status: 200,
    description: 'Search results returned successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'At least one search parameter is required',
  })
  async search(@Query() searchQueryDto: SearchQueryDto) {
    return this.searchService.search(searchQueryDto);
  }
}
