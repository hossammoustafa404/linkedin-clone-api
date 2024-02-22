import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class FindOneQueryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  senderId: UUID;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  recieverId: UUID;
}
