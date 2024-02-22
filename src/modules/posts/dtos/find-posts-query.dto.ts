import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsISO8601, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { UUID } from 'crypto';
import { FindManyQueryDto } from '../../../shared/dtos';

export class FindPostsQueryDto extends PartialType(FindManyQueryDto) {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  userId: UUID;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsISO8601()
  createdAt?: Date;
}
