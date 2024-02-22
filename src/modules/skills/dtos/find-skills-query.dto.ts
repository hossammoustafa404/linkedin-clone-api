import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FindSkillsQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;
}
