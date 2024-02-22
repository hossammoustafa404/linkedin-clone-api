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
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/guards';
import {
  CreatePostDto,
  FindNewsFeedPostsQueryDto,
  FindPostsQueryDto,
  UpdatePostDto,
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
import { responseWithPagination } from '../../shared/utils';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiCreatedResponse({
    description: 'The post has been successfully created',
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createOne(
    @Body() createPostDto: CreatePostDto,
    @Req() reqWithUser: RequestWithUser,
  ) {
    const post = await this.postsService.createOne(
      createPostDto,
      reqWithUser?.user?.id,
    );
    return post;
  }

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiOkResponse({ description: 'The posts have been successfully gotten' })
  @UseGuards(JwtAuthGuard)
  @Get('news-feed')
  async findNewsFeedPosts(
    @Req() reqWithUser: RequestWithUser,
    @Query() query: FindNewsFeedPostsQueryDto,
  ) {
    const { posts, totalCount, page, limit } =
      await this.postsService.findNewsFeedPosts(reqWithUser?.user?.id, query);
    return responseWithPagination(
      {
        totalCount,
        pageCount: posts.length,
        currentPage: page,
        limit,
      },
      posts,
    );
  }

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiOkResponse({ description: 'The posts have been successfully gotten' })
  @UseGuards(JwtAuthGuard)
  @Get()
  async findMany(@Query() query: FindPostsQueryDto) {
    const { posts, totalCount, page, limit } =
      await this.postsService.findMany(query);
    return responseWithPagination(
      {
        totalCount,
        pageCount: posts.length,
        currentPage: page,
        limit,
      },
      posts,
    );
  }

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'The post does not exist' })
  @ApiOkResponse({ description: 'The post has been successfully gotten' })
  @UseGuards(JwtAuthGuard)
  @Get(':postId')
  async findOneById(@Param('postId', ParseUUIDPipe) postId: UUID) {
    const post = await this.postsService.findOneById(postId);

    if (!post) {
      throw new NotFoundException('The post does not exist');
    }

    return { post };
  }

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'The post does not exist' })
  @ApiOkResponse({ description: 'The post has been successfully updated' })
  @UseGuards(JwtAuthGuard)
  @Patch(':postId')
  async updateOneById(
    @Param('postId', ParseUUIDPipe) postId: UUID,
    @Body() updatePostDto: UpdatePostDto,
    @Req() reqWithUser: RequestWithUser,
  ) {
    const post = await this.postsService.updateOneById(
      postId,
      updatePostDto,
      reqWithUser.user.id,
    );
    return { post };
  }

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'The post does not exist' })
  @ApiNoContentResponse({
    description: 'The post has been successfully deleted',
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':postId')
  async deleteOneById(
    @Param('postId', ParseUUIDPipe) postId: UUID,
    @Req() reqWithUser: RequestWithUser,
  ) {
    await this.postsService.deleteOneById(postId, reqWithUser.user.id);
  }
}
