import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserReaction } from './entities';
import { Repository } from 'typeorm';
import { PostsService } from '../posts/posts.service';
import { ReactionsService } from '../reactions/reactions.service';
import { UUID } from 'crypto';
import { CommentsService } from '../comments/comments.service';

@Injectable()
export class PostsReactionsService {
  constructor(
    @InjectRepository(UserReaction)
    private readonly userReactionRepository: Repository<UserReaction>,
    private readonly postsService: PostsService,
    private readonly commentsService: CommentsService,
    private readonly reactionsService: ReactionsService,
  ) {}

  async createOnePostReaction(
    postId: UUID,
    reactionId: UUID,
    currentUserId: UUID,
  ) {
    // Check that the post exists
    const foundPost = await this.postsService.findOneById(postId);
    if (!foundPost) {
      throw new NotFoundException('The post does not exist');
    }

    // Check that the reaction exists
    const foundReaction = await this.reactionsService.findOneById(reactionId);
    if (!foundReaction) {
      throw new NotFoundException('The reaction does not exist');
    }

    // Check that the user has no reaction on the post
    const searchedPostReaction = await this.findOnePostReaction(
      postId,
      currentUserId,
    );

    if (searchedPostReaction) {
      throw new ConflictException('The user has already reacted to the post');
    }

    // Create the post reaction
    const {
      raw: [createdPostReaction],
    } = await this.userReactionRepository
      .createQueryBuilder()
      .insert()
      .values({
        siteUser: { id: currentUserId },
        post: { id: postId },
        reaction: { id: reactionId },
      })
      .returning('id')
      .execute();

    // Find the created post reaction
    const foundPostReaction = await this.findOneUserReactionById(
      createdPostReaction.id,
    );

    // Return the found post reaction
    return foundPostReaction;
  }

  async findManyPostReactions(postId: UUID) {
    // Find the post reactions and thier count
    const [postReactions, postReactionsCount] =
      await this.userReactionRepository
        .createQueryBuilder()
        .setFindOptions({
          relations: {
            siteUser: { profile: true },
            post: true,
            reaction: true,
          },
        })
        .where({ post: { id: postId } })
        .getManyAndCount();

    // Return the post reactions and their count
    return { postReactions, count: postReactionsCount };
  }
  async createOneCommentReaction(
    commentId: UUID,
    reactionId: UUID,
    currentUserId: UUID,
  ) {
    // Check that the comment exists
    const foundcomment = await this.commentsService.findOneById(commentId);
    if (!foundcomment) {
      throw new NotFoundException('The comment does not exist');
    }

    // Check that the reaction exists
    const foundReaction = await this.reactionsService.findOneById(reactionId);
    if (!foundReaction) {
      throw new NotFoundException('The reaction does not exist');
    }

    // Check that the user has no reaction on the comment
    const searchedCommentReaction = await this.findOneCommentReaction(
      commentId,
      currentUserId,
    );

    if (searchedCommentReaction) {
      throw new ConflictException(
        'The user has already reacted to the comment',
      );
    }

    // Create the comment reaction
    const {
      raw: [createdCommentReaction],
    } = await this.userReactionRepository
      .createQueryBuilder()
      .insert()
      .values({
        siteUser: { id: currentUserId },
        comment: { id: commentId },
        reaction: { id: reactionId },
      })
      .returning('id')
      .execute();

    // Find the created comment reaction
    const foundCommentReaction = await this.findOneUserReactionById(
      createdCommentReaction.id,
    );

    // Return the found comment reaction
    return foundCommentReaction;
  }

  async findManyCommentReactions(commentId: UUID) {
    // Find the comment reactions and thier count
    const [commentReactions, commentReactionsCount] =
      await this.userReactionRepository
        .createQueryBuilder()
        .setFindOptions({
          relations: {
            siteUser: { profile: true },
            comment: true,
            reaction: true,
          },
        })
        .where({ comment: { id: commentId } })
        .getManyAndCount();

    // Return the comment reactions and their count
    return { commentReactions, count: commentReactionsCount };
  }

  async deleteOneUserReaction(userReactionId: UUID, currentUserId: UUID) {
    // Find the user reaction
    const searchedUserReaction =
      await this.findOneUserReactionById(userReactionId);

    // Throw not found exception if the user reaction does not exist
    if (!searchedUserReaction) {
      throw new NotFoundException('The user reaction does not exist');
    }

    // Check the ability of the current user to delete the user reaction
    if (searchedUserReaction.siteUser.id !== currentUserId) {
      throw new UnauthorizedException(
        'The user cannot delete a user reaction belongs to another user',
      );
    }

    // Delete the user reaction
    await this.userReactionRepository
      .createQueryBuilder()
      .delete()
      .where({ id: userReactionId })
      .execute();
  }

  async findOneUserReactionById(userReactionId: UUID) {
    // Find the user reaction
    const foundPostReaction = await this.userReactionRepository
      .createQueryBuilder()
      .setFindOptions({ relations: { reaction: true, siteUser: true } })
      .where({ id: userReactionId })
      .getOne();

    // Return the user reaction
    return foundPostReaction;
  }

  async findOneCommentReaction(commentId: UUID, userId: UUID) {
    // Find the comment reaction
    const foundCommentReaction = await this.userReactionRepository
      .createQueryBuilder()
      .where({ comment: { id: commentId }, siteUser: { id: userId } })
      .getOne();

    // Return the comment reaction
    return foundCommentReaction;
  }

  async findOnePostReaction(postId: UUID, userId: UUID) {
    // Find the post reaction
    const foundPostReaction = await this.userReactionRepository
      .createQueryBuilder()
      .where({ post: { id: postId }, siteUser: { id: userId } })
      .getOne();

    // Return the post reaction
    return foundPostReaction;
  }
}
