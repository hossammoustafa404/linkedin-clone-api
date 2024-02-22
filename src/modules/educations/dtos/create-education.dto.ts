import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEducationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  school: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  degree: string;

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
  grade: string;
}
