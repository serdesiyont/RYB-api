import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CourseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}
