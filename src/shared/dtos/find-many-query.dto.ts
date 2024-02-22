import { ApiParam, ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class FindManyQueryDto {
  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @IsNumberString()
  page?: number;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @IsNumberString()
  limit?: number;

  @ApiProperty({ required: false, default: 'createdAt' })
  @IsOptional()
  @IsString()
  sort?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  keyword?: string;
}
