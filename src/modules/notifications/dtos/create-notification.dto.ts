import { UUID } from 'crypto';
import { RecordAction, EntityEnum } from '../enums';
import { ArrayMinSize, IsArray, IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @IsUUID(undefined, { each: true })
  @ArrayMinSize(1)
  recieversIds: UUID[];

  @ApiProperty({ enum: EntityEnum })
  @IsNotEmpty()
  @IsEnum(EntityEnum)
  entity: EntityEnum;

  // @IsNotEmpty()
  // @IsEnum(RecordAction)
  // action: RecordAction;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  message: string;
}
