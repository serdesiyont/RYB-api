import {
  IsNotEmpty,
  IsString,
  IsNumber,
  Min,
  Max,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLecturerRatingDto {
  @ApiProperty({ description: 'ID of the lecturer being rated' })
  @IsNotEmpty()
  @IsString()
  lecturerId: string;

  @ApiProperty({ description: 'Course name' })
  @IsNotEmpty()
  @IsString()
  course: string;

  @ApiProperty({
    description: 'Difficulty rating (1-5)',
    minimum: 1,
    maximum: 5,
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  difficulty: number;

  @ApiProperty({ description: 'Quality rating (1-5)', minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  quality: number;

  @ApiProperty({ description: 'Credit hours (1-5)', minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  creditHr: number;

  @ApiProperty({ description: 'Grade received', example: 'A' })
  @IsNotEmpty()
  @IsString()
  grade: string;

  @ApiProperty({ description: 'Whether textbook was required', default: false })
  @IsBoolean()
  textbook: boolean;

  @ApiProperty({ description: 'Optional comment', required: false })
  @IsOptional()
  @IsString()
  comment?: string;
}
