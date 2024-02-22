import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateReactionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}
