import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class FindExpriencesQueryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  profileId: UUID;
}
