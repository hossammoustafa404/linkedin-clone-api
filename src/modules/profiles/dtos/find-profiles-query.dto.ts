import {
  IsEnum,
  IsISO8601,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { Gender } from '../enums';
import { FindManyQueryDto } from '../../../shared/dtos';
import { ApiProperty } from '@nestjs/swagger';

export class FindProfilesQueryDto extends FindManyQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsISO8601()
  dateOfBirth?: Date;
}
