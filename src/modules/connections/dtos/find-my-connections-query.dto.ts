import { IsEnum, IsOptional } from 'class-validator';
import { ConnectionStatus, ConnectionType } from '../enums';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { FindManyQueryDto } from '../../../shared/dtos';

export class FindMyConnectionsQueryDto extends PartialType(
  OmitType(FindManyQueryDto, ['keyword']),
) {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(ConnectionType)
  type?: ConnectionType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(ConnectionStatus)
  status?: ConnectionStatus;
}
