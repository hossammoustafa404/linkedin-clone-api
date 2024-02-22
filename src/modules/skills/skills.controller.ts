import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SkillsService } from './skills.service';
import { JwtAuthGuard } from '../auth/guards';
import { FindSkillsQueryDto } from './dtos';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Skills')
@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiOkResponse({ description: 'The skills have been successfully gotten' })
  @UseGuards(JwtAuthGuard)
  @Get()
  async findMany(@Query() query: FindSkillsQueryDto) {
    const { totalCount, skills } = await this.skillsService.findMany(query);
    return { totalCount, skills };
  }
}
