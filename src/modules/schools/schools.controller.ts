import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SchoolsService } from './schools.service';
import { JwtAuthGuard } from '../auth/guards';
import { FindSchoolsQueryDto } from './dtos';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Schools')
@Controller('schools')
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiOkResponse({ description: 'The schools have been successfully gotten' })
  @UseGuards(JwtAuthGuard)
  @Get()
  async findMany(@Query() query: FindSchoolsQueryDto) {
    const { schools, totalCount } = await this.schoolsService.findMany(query);
    return { totalCount, schools };
  }
}
