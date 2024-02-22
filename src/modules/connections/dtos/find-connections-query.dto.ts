import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { ConnectionStatus } from '../enums';
import { UUID } from 'crypto';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { FindManyQueryDto } from '../../../shared/dtos';

export class FindConnectionsQueryDto extends PartialType(
  OmitType(FindManyQueryDto, ['keyword']),
) {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  userId: UUID;
}
