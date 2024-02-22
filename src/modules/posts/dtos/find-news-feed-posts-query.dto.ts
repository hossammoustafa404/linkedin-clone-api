import { OmitType, PartialType } from '@nestjs/swagger';
import { FindManyQueryDto } from '../../../shared/dtos';

export class FindNewsFeedPostsQueryDto extends PartialType(
  OmitType(FindManyQueryDto, ['keyword']),
) {}
