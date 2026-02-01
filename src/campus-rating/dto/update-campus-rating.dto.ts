import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateCampusRatingDto } from './create-campus-rating.dto';

export class UpdateCampusRatingDto extends PartialType(
  OmitType(CreateCampusRatingDto, ['campusId'] as const),
) {}
