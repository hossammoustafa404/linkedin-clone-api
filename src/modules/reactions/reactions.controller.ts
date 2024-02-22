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
  UseGuards,
} from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { JwtAuthGuard } from '../auth/guards';
import { RolesGuard } from '../../shared/guards';
import { Roles } from '../../shared/decorators';
import { UserRole } from '../users/enums';
import { CreateReactionDto, UpdateReactionDto } from './dtos';
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

@ApiTags('Reactions')
@Controller('reactions')
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiCreatedResponse({
    description: 'The reaction has been successfully created',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SuperAdmin)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createOne(@Body() createReactionDto: CreateReactionDto) {
    const reaction = await this.reactionsService.createOne(createReactionDto);
    return { reaction };
  }

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiOkResponse({ description: 'The reactions have been successfully gotten' })
  @UseGuards(JwtAuthGuard)
  @Get()
  async findMany() {
    const { reactions, count } = await this.reactionsService.findMany();
    return { count, reactions };
  }

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'The reaction does not exist' })
  @ApiOkResponse({ description: 'The reaction has been successfully gotten' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SuperAdmin)
  @Get(':reactionId')
  async findOneById(@Param('reactionId', ParseUUIDPipe) reactionId: UUID) {
    const reaction = await this.reactionsService.findOneById(reactionId);
    return { reaction };
  }

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'The reaction does not exist' })
  @ApiOkResponse({ description: 'The reaction has been successfully updated' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SuperAdmin)
  @Patch(':reactionId')
  async updateOneById(
    @Param('reactionId', ParseUUIDPipe) reactionId: UUID,
    @Body() updateReactionDto: UpdateReactionDto,
  ) {
    const reaction = await this.reactionsService.updateOneById(
      reactionId,
      updateReactionDto,
    );
    return { reaction };
  }

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'The reaction does not exist' })
  @ApiNoContentResponse({
    description: 'The reaction has been successfully deleted',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SuperAdmin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':reactionId')
  async deleteOneById(@Param('reactionId', ParseUUIDPipe) reactionId: UUID) {
    await this.reactionsService.deleteOneById(reactionId);
  }
}
