import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities';
import { In, Repository } from 'typeorm';
import { CreatePostDto, FindPostsQueryDto, UpdatePostDto } from './dtos';
import { UUID } from 'crypto';
import { ConnectionsService } from '../connections/connections.service';
import { ApiFeatures } from 'src/shared/utils';
import { FindNewsFeedPostsQueryDto } from './dtos';
import { PublicFilesService } from '../public-files/public-files.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    private readonly connectionsService: ConnectionsService,
    private readonly publicFilessService: PublicFilesService,
  ) {}

  async createOne(createPostDto: CreatePostDto, currentUserId: UUID) {
    // Create the post
    const { imagesIds, videosIds, ...rest } = createPostDto;
    const {
      raw: [createdPost],
    } = await this.postRepository
      .createQueryBuilder()
      .insert()
      .values({ ...rest, owner: { id: currentUserId } })
      .returning('*')
      .execute();

    // Find the created post by id
    const foundPost = await this.findOneById(createdPost.id);

    // Add images to the post if they exist
    if (imagesIds?.length) {
      const images = await this.publicFilessService.assignOneEntityToManyImages(
        imagesIds,
        {
          id: foundPost.id,
          name: 'post',
        },
      );

      if (images?.length) {
        foundPost.images = images;
      } else {
        foundPost.images = [];
      }
    }

    // Add videos to the post if they exist
    if (videosIds?.length) {
      const videos = await this.publicFilessService.assignOneEntityToManyVideos(
        videosIds,
        {
          id: foundPost.id,
          name: 'post',
        },
      );

      if (videos?.length) {
        foundPost.videos = videos;
      } else {
        foundPost.videos = [];
      }
    }

    // Return the found post
    return foundPost;
  }

  async findNewsFeedPosts(
    currentUserId: UUID,
    query: FindNewsFeedPostsQueryDto,
  ) {
    // Find the accepted connections of the current user
    const { connections: foundConnections } =
      await this.connectionsService.findMany({
        userId: currentUserId,
      });

    // Make an array of users in my connections
    const connUsersIds = foundConnections.map(({ sender, reciever }) => {
      if (sender.id !== currentUserId) {
        return sender.id;
      } else if (reciever.id !== currentUserId) {
        return reciever.id;
      }
    });

    // Initialize the sql query
    const findPostsSqlQuery = this.postRepository
      .createQueryBuilder('post')
      .setFindOptions({
        relations: { owner: { profile: true }, images: true, videos: true },
      })
      .where([
        { owner: { id: currentUserId } },
        { owner: { id: In(connUsersIds) } },
      ]);

    // Add api features
    const apiFeatures = new ApiFeatures(findPostsSqlQuery, query)
      .sort()
      .paginate();

    // Find the posts of mine and the posts of the found connections and posts count
    const [foundPosts, totalCount] =
      await apiFeatures.sqlQuery.getManyAndCount();

    // Return the found posts and thier count
    return {
      posts: foundPosts,
      totalCount,
      page: query?.page || 1,
      limit: query?.limit || 10,
    };
  }

  async findMany(query: FindPostsQueryDto) {
    // Initialize the sql query
    const findPostsSqlQuery = this.postRepository
      .createQueryBuilder('post')
      .setFindOptions({
        relations: { owner: { profile: true }, images: true, videos: true },
      });

    // Add a filter by owner id if it exist
    if (query?.userId) {
      findPostsSqlQuery.where({ owner: { id: query.userId } });
      delete query.userId;
    }

    // Add api features
    const apiFeatures = new ApiFeatures(findPostsSqlQuery, query)
      .filter()
      .search(['content'])
      .sort()
      .paginate();

    // Execute the query
    const [foundPosts, totalCount] =
      await apiFeatures.sqlQuery.getManyAndCount();

    // Return the posts with pagination data
    return {
      posts: foundPosts,
      totalCount,
      page: query?.page || 1,
      limit: query?.limit || 10,
    };
  }
  async findOneById(postId: UUID) {
    // Find the post
    const foundPost = await this.postRepository
      .createQueryBuilder()
      .setFindOptions({
        relations: { owner: { profile: true }, images: true, videos: true },
      })
      .where({ id: postId })
      .getOne();

    // Return the found post
    return foundPost;
  }

  async updateOneById(
    postId: UUID,
    updatePostDto: UpdatePostDto,
    currentUserId: UUID,
  ) {
    // Find the post
    const searchedPost = await this.findOneById(postId);

    // Throw a not found exception if the post does not exist
    if (!searchedPost) {
      throw new NotFoundException('The post does not exist');
    }

    // Check the ability of the current user to update the post
    if (searchedPost.owner.id !== currentUserId) {
      throw new UnauthorizedException(
        'The user cannot update a post belongos to another user',
      );
    }

    // Update the post
    const {
      raw: [updatedPost],
    } = await this.postRepository
      .createQueryBuilder()
      .update()
      .set(updatePostDto)
      .where({ id: postId })
      .returning('id')
      .execute();

    // Find the updated post
    const foundPost = await this.findOneById(updatedPost.id);

    // Return the found updated post
    return foundPost;
  }

  async deleteOneById(postId: UUID, currentUserId: UUID) {
    // Find the post
    const searchedPost = await this.findOneById(postId);

    // Throw a not found exception if the post does not exist
    if (!searchedPost) {
      throw new NotFoundException('The post does not exist');
    }

    // Check the ability of the current user to delete the post
    if (searchedPost.owner.id !== currentUserId) {
      throw new UnauthorizedException(
        'The user cannot delete a post belongos to another user',
      );
    }

    // Delete the post
    await this.postRepository
      .createQueryBuilder()
      .delete()
      .where({ id: postId })
      .execute();
  }
}
