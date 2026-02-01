import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min, Max } from 'class-validator';

export class CreateCampusRatingDto {
  @ApiProperty({ description: 'Campus ID being rated' })
  @IsString()
  @IsNotEmpty()
  campusId: string;

  @ApiProperty({
    description: 'Reputation rating (1-5)',
    minimum: 1,
    maximum: 5,
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  reputation: number;

  @ApiProperty({ description: 'Social rating (1-5)', minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  social: number;

  @ApiProperty({ description: 'Clubs rating (1-5)', minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  clubs: number;

  @ApiProperty({
    description: 'Opportunities rating (1-5)',
    minimum: 1,
    maximum: 5,
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  opportunities: number;

  @ApiProperty({ description: 'Location rating (1-5)', minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  location: number;

  @ApiProperty({
    description: 'Happiness rating (1-5)',
    minimum: 1,
    maximum: 5,
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  happiness: number;

  @ApiProperty({
    description: 'Facilities rating (1-5)',
    minimum: 1,
    maximum: 5,
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  facilities: number;

  @ApiProperty({ description: 'Safety rating (1-5)', minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  safety: number;

  @ApiProperty({ description: 'Internet rating (1-5)', minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  internet: number;

  @ApiProperty({ description: 'Food rating (1-5)', minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  food: number;
}
