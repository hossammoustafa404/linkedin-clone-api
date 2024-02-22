import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ExpriencesService } from './expriences.service';
import { JwtAuthGuard } from '../auth/guards';
import {
  CreateExprienceDto,
  FindExpriencesQueryDto,
  UpdateExprienceDto,
} from './dtos';
import { RequestWithUser } from '../../shared/interfaces';
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

@ApiTags('Expriences')
@Controller('expriences')
export class ExpriencesController {
  constructor(private readonly expriencesService: ExpriencesService) {}

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiCreatedResponse({
    description: 'The exprience has been successfully created',
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createOne(
    @Body() createExprienceDto: CreateExprienceDto,
    @Req() reqWithUser: RequestWithUser,
  ) {
    const exprience = await this.expriencesService.createOne(
      createExprienceDto,
      reqWithUser.user.profile.id,
    );
    return { exprience };
  }

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiOkResponse({
    description: 'The expriences have been successfully gotten',
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  async findMany(@Query() query: FindExpriencesQueryDto) {
    const { expriences, count } = await this.expriencesService.findMany(query);
    return { count, expriences };
  }

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'The exprience does not exist' })
  @ApiOkResponse({ description: 'The experience has been successfully gotten' })
  @UseGuards(JwtAuthGuard)
  @Get(':exprienceId')
  async findOneById(@Param('exprienceId', ParseUUIDPipe) exprienceId: UUID) {
    const exprience = await this.expriencesService.findOneById(exprienceId);
    if (!exprience) {
      throw new NotFoundException('The exprience does not exist');
    }
    return { exprience };
  }

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'The experience does not exist' })
  @ApiOkResponse({
    description: 'The experience has been successfully updated',
  })
  @UseGuards(JwtAuthGuard)
  @Patch(':exprienceId')
  async updateOneById(
    @Param('exprienceId', ParseUUIDPipe) exprienceId: UUID,
    @Body() updateExprienceDto: UpdateExprienceDto,
    @Req() reqWithUser: RequestWithUser,
  ) {
    const exprience = await this.expriencesService.updateOneById(
      exprienceId,
      updateExprienceDto,
      reqWithUser.user.profile.id,
    );
    return { exprience };
  }

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'The exprience does not exist' })
  @ApiNoContentResponse({
    description: 'The experience has been successfully deleted',
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':exprienceId')
  async DeleteOneById(
    @Param('exprienceId', ParseUUIDPipe) exprienceId: UUID,
    @Req() reqWithUser: RequestWithUser,
  ) {
    await this.expriencesService.deleteOneById(
      exprienceId,
      reqWithUser.user.profile.id,
    );
  }
}
