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
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/guards';
import { RequestWithUser } from '../../shared/interfaces';
import { UUID } from 'crypto';
import {
  CreateCommentDto,
  FindCommentsQueryDto,
  UpdateCommentDto,
} from './dtos';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { responseWithPagination } from '../../shared/utils';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiCreatedResponse({
    description: 'The comment has been successfully created',
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createOne(
    @Body() createCommentDto: CreateCommentDto,
    @Req() reqWithUser: RequestWithUser,
  ) {
    const comment = await this.commentsService.createOne(
      createCommentDto,
      reqWithUser?.user?.id,
    );
    return { comment };
  }

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiOkResponse({ description: 'The comments have been successfully gotten' })
  @UseGuards(JwtAuthGuard)
  @Get()
  async findMany(@Query() query: FindCommentsQueryDto) {
    const { comments, totalCount, page, limit } =
      await this.commentsService.findMany(query);
    return responseWithPagination(
      { totalCount, pageCount: comments.length, currentPage: page, limit },
      comments,
    );
  }

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'The comment does not exist' })
  @ApiOkResponse({ description: 'The comment has been successfully gotten' })
  @UseGuards(JwtAuthGuard)
  @Get(':commentId')
  async findOneById(@Param('commentId', ParseUUIDPipe) commentId: UUID) {
    const comment = await this.commentsService.findOneById(commentId);
    if (!comment) {
      throw new NotFoundException('The comment does not exist');
    }
    return { comment };
  }

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'The comment does not exist' })
  @ApiOkResponse({ description: 'The comment has been successfully updated' })
  @UseGuards(JwtAuthGuard)
  @Patch(':commentId')
  async updateOneById(
    @Param('commentId', ParseUUIDPipe) commentId: UUID,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() reqWithUser: RequestWithUser,
  ) {
    const comment = await this.commentsService.updateOneById(
      commentId,
      updateCommentDto,
      reqWithUser?.user?.id,
    );
    return { comment };
  }

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'The comment does not exist' })
  @ApiNoContentResponse({
    description: 'The comment has been successfully deleted',
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':commentId')
  async deleteOneById(
    @Param('commentId', ParseUUIDPipe) commentId: UUID,
    @Req() reqWithUser: RequestWithUser,
  ) {
    await this.commentsService.deleteOneById(commentId, reqWithUser?.user?.id);
  }
}
