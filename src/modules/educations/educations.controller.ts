import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EducationsService } from './educations.service';
import { JwtAuthGuard } from '../auth/guards';
import { RequestWithUser } from '../../shared/interfaces';
import {
  CreateEducationDto,
  FindEducationsQueryDto,
  UpdateEducationDto,
} from './dtos';
import { UUID } from 'crypto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Educations')
@Controller('educations')
export class EducationsController {
  constructor(private readonly educationsService: EducationsService) {}

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiCreatedResponse({
    description: 'The education has been successfully created',
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createOne(
    @Req() reqWithUser: RequestWithUser,
    @Body() createEducationDto: CreateEducationDto,
  ) {
    const education = await this.educationsService.createOne(
      reqWithUser?.user?.profile?.id,
      createEducationDto,
    );
    return education;
  }

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiOkResponse({
    description: 'The educations have been successfully gotten',
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  async findMany(@Query() query: FindEducationsQueryDto) {
    const { count, educations } = await this.educationsService.findMany(query);
    return { count, educations };
  }

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'The education does not exist' })
  @ApiOkResponse({ description: 'The education has been successfully gotten' })
  @UseGuards(JwtAuthGuard)
  @Get(':educationId')
  async findOneById(@Param('educationId', ParseUUIDPipe) educationId: UUID) {
    const education = await this.educationsService.findOneById(educationId);
    return { education };
  }

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'The education does not exist' })
  @ApiOkResponse({ description: 'The education has been successfully updated' })
  @UseGuards(JwtAuthGuard)
  @Patch(':educationId')
  async updateOneById(
    @Param('educationId', ParseUUIDPipe) educationId: UUID,
    @Body() updateEducationDto: UpdateEducationDto,
    @Req() reqWithUser: RequestWithUser,
  ) {
    const education = await this.educationsService.updateOneById(
      educationId,
      updateEducationDto,
      reqWithUser?.user?.profile?.id,
    );
    return { education };
  }

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'The education does not exist' })
  @ApiNoContentResponse({
    description: 'The education has been successfully deleted',
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':educationId')
  async deleteOneById(
    @Param('educationId', ParseUUIDPipe) educationId: UUID,
    @Req() reqWithUser: RequestWithUser,
  ) {
    await this.educationsService.deleteOneById(
      educationId,
      reqWithUser?.user?.profile?.id,
    );
  }
}
