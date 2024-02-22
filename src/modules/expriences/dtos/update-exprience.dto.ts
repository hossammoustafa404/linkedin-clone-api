import { PartialType } from '@nestjs/swagger';
import { CreateExprienceDto } from './create-exprience.dto';

export class UpdateExprienceDto extends PartialType(CreateExprienceDto) {}
