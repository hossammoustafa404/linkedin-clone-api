import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from '../enums/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ required: false, enum: UserRole })
  @IsNotEmpty()
  @IsEnum(UserRole)
  role?: UserRole;
}
