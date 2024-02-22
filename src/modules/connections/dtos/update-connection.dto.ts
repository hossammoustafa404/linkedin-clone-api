import { IsEnum, IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { ConnectionStatus } from '../enums';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateConnectionDto {
  @ApiProperty({
    required: false,
    enum: [ConnectionStatus.Accepted, ConnectionStatus.Rejected],
  })
  @IsOptional()
  @IsIn([ConnectionStatus.Accepted, ConnectionStatus.Rejected])
  status?: ConnectionStatus.Accepted | ConnectionStatus.Rejected;
}
