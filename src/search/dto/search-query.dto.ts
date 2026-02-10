import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SearchQueryDto {
  @ApiProperty({
    description: 'Lecturer name to search for',
    required: false,
  })
  @IsOptional()
  @IsString()
  lecturerName?: string;

  @ApiProperty({
    description: 'Campus/University name to search for',
    required: false,
  })
  @IsOptional()
  @IsString()
  campusName?: string;
}
