import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateLecturerRatingDto } from './create-lecturer-rating.dto';

export class UpdateLecturerRatingDto extends PartialType(
  OmitType(CreateLecturerRatingDto, ['lecturerId'] as const),
) {}
