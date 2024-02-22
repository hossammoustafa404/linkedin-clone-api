import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities';
import { Repository } from 'typeorm';
import {
  CreateCommentDto,
  FindCommentsQueryDto,
  UpdateCommentDto,
} from './dtos';
import { UUID } from 'crypto';
import { ApiFeatures } from 'src/shared/utils';
import { PublicFilesService } from '../public-files/public-files.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly publicFilesService: PublicFilesService,
  ) {}

  async createOne(createCommentDto: CreateCommentDto, currentUserId: UUID) {
    let finalCommentValues: any = { author: { id: currentUserId } };

    // Initialize the sql query
    const createCommentQuery = this.commentRepository
      .createQueryBuilder()
      .insert();

    // Add post id to the values if the comment is on a post
    const { postId, parentId } = createCommentDto;
    if (postId) {
      // Check that the post exists
      finalCommentValues.post = { id: postId };
      delete createCommentDto.postId;
    }

    // Add parent id to the values if the comment is a reply to another comment
    if (parentId) {
      finalCommentValues.parent = { id: parentId };
      delete createCommentDto.parentId;
    }

    const { imageId, videoId, ...rest } = createCommentDto;

    // Execute the sql query
    finalCommentValues = { ...finalCommentValues, ...rest };
    const {
      raw: [createdComment],
    } = await createCommentQuery
      .values(finalCommentValues)
      .returning('id')
      .execute();

    // Find the created comment
    const foundComment = await this.findOneById(createdComment.id);

    // Add image if it is provided
    if (imageId) {
      console.log(imageId);

      if (foundComment.image?.id) {
        await this.publicFilesService.deleteOneImage(foundComment.image?.id);
      }

      const image = await this.publicFilesService.assignOneEntityToImage(
        imageId,
        {
          id: foundComment.id,
          name: 'comment',
        },
      );

      if (image) {
        foundComment.image = image;
      } else {
        foundComment.image = null;
      }
    }

    // Add video if it is provided
    if (videoId) {
      if (foundComment.video?.id) {
        await this.publicFilesService.deleteOneVideo(foundComment.video?.id);
      }

      const video = await this.publicFilesService.assignOneEntityToVideo(
        videoId,
        {
          id: foundComment.id,
          name: 'comment',
        },
      );

      if (video) {
        foundComment.video = video;
      } else {
        foundComment.video = null;
      }
    }

    // Return the found comment
    return foundComment;
  }

  async findMany(query: FindCommentsQueryDto) {
    // Intialize the sql query
    const findCommentsSqlQuery = this.commentRepository
      .createQueryBuilder('comment')
      .setFindOptions({
        relations: {
          post: true,
          parent: true,
          author: { profile: true },
          image: true,
          video: true,
        },
      });

    // Add a filter by post id if it is provided
    const { postId, parentId } = query;
    if (postId) {
      findCommentsSqlQuery.where({ post: { id: postId } });
      delete query.postId;
    }
    // Add a filter by parent id if it is provided
    else if (parentId) {
      findCommentsSqlQuery.where({ parent: { id: parentId } });
      delete query.parentId;
    }

    // Add api features
    const apiFeatures = new ApiFeatures(findCommentsSqlQuery, query)
      .sort()
      .paginate();

    // Get many comments and thier count
    const [foundComments, totalCount] =
      await apiFeatures.sqlQuery.getManyAndCount();

    // Return the found comments with pagination data
    return {
      comments: foundComments,
      totalCount,
      page: query?.page || 1,
      limit: query?.limit || 10,
    };
  }

  async findOneById(commentId: UUID) {
    // Find the comment
    const foundComment = await this.commentRepository
      .createQueryBuilder()
      .setFindOptions({
        relations: {
          post: true,
          parent: true,
          author: { profile: true },
          image: true,
          video: true,
        },
      })
      .where({ id: commentId })
      .getOne();

    // Return the found comment
    return foundComment;
  }

  async updateOneById(
    commentId: UUID,
    updateCommentDto: UpdateCommentDto,
    currentUserId: UUID,
  ) {
    // Find the comment
    const searchedComment = await this.findOneById(commentId);

    // Throw a not found exception if the comment does not exist
    if (!searchedComment) {
      throw new NotFoundException('The comment does not exist');
    }

    // Check that the current user is the author of the comment
    if (currentUserId !== searchedComment.author.id) {
      throw new UnauthorizedException(
        'The user cannot update a comment of another user',
      );
    }

    // Update the comment
    const {
      raw: [updatedComment],
    } = await this.commentRepository
      .createQueryBuilder()
      .update()
      .set(updateCommentDto)
      .where({ id: commentId })
      .returning('id')
      .execute();

    // Find the updated comment
    const foundComment = await this.findOneById(updatedComment.id);

    // Return the found comment
    return foundComment;
  }

  async deleteOneById(commentId: UUID, currentUserId: UUID) {
    // Find the comment
    const searchedComment = await this.findOneById(commentId);

    // Throw a not found exception if the comment does not exist
    if (!searchedComment) {
      throw new NotFoundException('The comment does not exist');
    }

    // Check that the current user is the author of the comment
    if (currentUserId !== searchedComment.author.id) {
      throw new UnauthorizedException(
        'The user cannot update a comment of another user',
      );
    }

    // Delete the comment
    await this.commentRepository
      .createQueryBuilder()
      .delete()
      .where({ id: commentId })
      .execute();
  }
}
