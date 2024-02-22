import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { FindManyQueryDto } from 'src/shared/dtos';

export class FindSchoolsQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;
}
