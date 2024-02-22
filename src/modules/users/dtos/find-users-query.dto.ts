import { IsISO8601, IsOptional } from 'class-validator';
import { FindManyQueryDto } from '../../../shared/dtos';
import { ApiProperty } from '@nestjs/swagger';

export class FindUsersQueryDto extends FindManyQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsISO8601()
  createdAt?: Date;
}
