import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import { UUID } from 'crypto';

export class CreatePostDto {
  @ApiProperty({ required: false })
  @ValidateIf(
    (fields: CreatePostDto) =>
      (!fields.imagesIds?.length && !fields.videosIds?.length) ||
      !!fields.content,
  )
  @IsNotEmpty()
  @IsString()
  content?: string;

  @ApiProperty({ required: false })
  @ValidateIf(
    (fields: CreatePostDto) =>
      (!fields.content && !fields.videosIds?.length) ||
      !!fields.imagesIds?.length,
  )
  @IsNotEmpty()
  @IsUUID(undefined, { each: true })
  @IsArray()
  @ArrayMinSize(1)
  imagesIds?: UUID[];

  @ApiProperty({ required: false })
  @ValidateIf(
    (fields: CreatePostDto) =>
      (!fields.imagesIds?.length && !fields.content) ||
      !!fields.videosIds?.length,
  )
  @IsNotEmpty()
  @IsUUID(undefined, { each: true })
  @IsArray()
  @ArrayMinSize(1)
  videosIds?: UUID[];
}
