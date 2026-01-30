import { ApiProperty } from '@nestjs/swagger';

export class CreateLecturerDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  university: string;

  @ApiProperty()
  department: string;

  @ApiProperty()
  courses: string[];
}
