import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class CreateConnectionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  recieverId: UUID;
}
