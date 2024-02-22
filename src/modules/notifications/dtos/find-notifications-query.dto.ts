import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { FindManyQueryDto } from '../../../shared/dtos';
import { EntityEnum } from '../enums';
import { IsEnum, IsOptional } from 'class-validator';

export class FindNotificationsQueryDto extends PartialType(
  OmitType(FindManyQueryDto, ['keyword']),
) {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(EntityEnum)
  entity?: EntityEnum;
}
