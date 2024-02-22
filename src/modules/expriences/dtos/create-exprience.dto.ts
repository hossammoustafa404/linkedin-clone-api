import { ApiProperty } from '@nestjs/swagger';
import { EmploymentType, LocationType } from '../enums';
import {
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateExprienceDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ enum: EmploymentType })
  @IsNotEmpty()
  @IsEnum(EmploymentType)
  employmentType: EmploymentType;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  companyName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(LocationType)
  locationType: LocationType;

  @ApiProperty()
  @IsNotEmpty()
  @IsISO8601()
  startDate: Date;

  @ApiProperty()
  @IsOptional()
  @IsISO8601()
  endDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  industry: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;
}
