import { ApiProperty } from '@nestjs/swagger';

export class CourseDto {
  @ApiProperty()
  name: string;
}
