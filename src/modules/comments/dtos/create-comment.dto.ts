import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, ValidateIf } from 'class-validator';
import { UUID } from 'crypto';

export class CreateCommentDto {
  @ApiProperty({ required: false })
  @ValidateIf((fields: CreateCommentDto) => !fields.parentId || !!fields.postId)
  @IsNotEmpty()
  @IsUUID()
  postId?: UUID;

  @ApiProperty({ required: false })
  @ValidateIf((fields: CreateCommentDto) => !fields.postId || !!fields.parentId)
  @IsNotEmpty()
  @IsUUID()
  parentId?: UUID;

  @ApiProperty({ required: false })
  @ValidateIf(
    (fields: CreateCommentDto) =>
      (!fields.imageId && !fields.videoId) || !!fields.content,
  )
  @IsNotEmpty()
  @IsString()
  content?: string;

  @ApiProperty({ required: false })
  @ValidateIf(
    (fields: CreateCommentDto) =>
      (!fields.content && !fields.videoId) || !!fields.imageId,
  )
  @IsNotEmpty()
  @IsUUID()
  imageId?: UUID;

  @ApiProperty({ required: false })
  @ValidateIf(
    (fields: CreateCommentDto) =>
      (!fields.content && !fields.videoId) || !!fields.videoId,
  )
  @IsNotEmpty()
  @IsUUID()
  videoId?: UUID;
}
