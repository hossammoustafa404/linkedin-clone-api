import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateMeDto extends PartialType(
  OmitType(CreateUserDto, ['firstName', 'lastName']),
) {}
