import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, ValidateIf } from 'class-validator';
import { UUID } from 'crypto';
import { FindManyQueryDto } from 'src/shared/dtos';

export class FindCommentsQueryDto extends PartialType(
  OmitType(FindManyQueryDto, ['keyword']),
) {
  @ApiProperty({ required: false })
  @ValidateIf((fields: FindCommentsQueryDto) => !fields.parentId)
  @IsNotEmpty()
  @IsUUID()
  postId?: UUID;

  @ApiProperty({ required: false })
  @ValidateIf((fields: FindCommentsQueryDto) => !fields.postId)
  @IsNotEmpty()
  @IsUUID()
  parentId?: UUID;
}
