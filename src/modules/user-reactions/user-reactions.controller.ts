import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostsReactionsService } from './user-reactions.service';
import { JwtAuthGuard } from '../auth/guards';
import { UUID } from 'crypto';
import { RequestWithUser } from '../../shared/interfaces';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('User Reactions')
@Controller()
export class PostsReactionsController {
  constructor(private readonly userReactionsService: PostsReactionsService) {}

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiConflictResponse({
    description: 'Maybe the user has already a react on the post',
  })
  @ApiNotFoundResponse({ description: 'Maybe the reaction does not exist' })
  @ApiCreatedResponse({
    description: 'The user reaction on the post has been successfully created',
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('posts/:postId/reactions/:reactionId')
  async createOnePostReaction(
    @Param('postId', ParseUUIDPipe) postId: UUID,
    @Param('reactionId', ParseUUIDPipe) reactionId: UUID,
    @Req() reqWithUser: RequestWithUser,
  ) {
    const postReaction = await this.userReactionsService.createOnePostReaction(
      postId,
      reactionId,
      reqWithUser?.user?.id,
    );
    return { postReaction };
  }

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiOkResponse({
    description: 'The post reactions have been successfully gotten',
  })
  @UseGuards(JwtAuthGuard)
  @Get('posts/:postId/reactions')
  async findManyPostReactions(@Param('postId', ParseUUIDPipe) postId: UUID) {
    const { postReactions, count } =
      await this.userReactionsService.findManyPostReactions(postId);
    return { count, postReactions };
  }

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiConflictResponse({
    description: 'Maybe the user has already a react on the comment',
  })
  @ApiNotFoundResponse({ description: 'Maybe the reaction does not exist' })
  @ApiCreatedResponse({
    description:
      'The user reaction on the comment has been successfully created',
  })
  @UseGuards(JwtAuthGuard)
  @Post('comments/:commentId/reactions/:reactionId')
  async createOneCommentReaction(
    @Param('commentId', ParseUUIDPipe) commentId: UUID,
    @Param('reactionId', ParseUUIDPipe) reactionId: UUID,
    @Req() reqWithUser: RequestWithUser,
  ) {
    const commentReaction =
      await this.userReactionsService.createOneCommentReaction(
        commentId,
        reactionId,
        reqWithUser?.user?.id,
      );
    return { commentReaction };
  }

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiOkResponse({
    description: 'The comment reactions have been successfully gotten',
  })
  @UseGuards(JwtAuthGuard)
  @Get('comments/:commentId/reactions')
  async findManyCommentReactions(
    @Param('commentId', ParseUUIDPipe) commentId: UUID,
  ) {
    const { commentReactions, count } =
      await this.userReactionsService.findManyCommentReactions(commentId);
    return { count, commentReactions };
  }

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'The user reaction does not exist' })
  @ApiNoContentResponse({
    description: 'The user reaction has been successfully deleted',
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('users-reactions/:userReactionId')
  async deleteOneUserReactionById(
    @Param('userReactionId', ParseUUIDPipe) userReactionId: UUID,
    @Req() reqWithUser: RequestWithUser,
  ) {
    await this.userReactionsService.deleteOneUserReaction(
      userReactionId,
      reqWithUser.user.id,
    );
  }
}
