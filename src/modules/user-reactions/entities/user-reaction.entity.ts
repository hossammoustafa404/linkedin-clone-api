import { Reaction } from '../../reactions/entities';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Post } from '../../posts/entities';
import { SiteUser } from '../../users/entities';
import { Comment } from '../../../modules/comments/entities';
import { CustomBaseEntity } from '../../../shared/database/entities';

@Entity({ name: 'postReaction' })
export class UserReaction extends CustomBaseEntity {
  @ManyToOne((type) => Reaction, (reaction) => reaction.postReactions, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'reactionId' })
  reaction: Reaction;

  @ManyToOne((type) => Post, (post) => post.userReactions, { nullable: true })
  @JoinColumn({ name: 'postId' })
  post: Post;

  @ManyToOne((type) => Comment, (comment) => comment.userReactions)
  @JoinColumn({ name: 'commentId' })
  comment: Comment;

  @ManyToOne((type) => SiteUser, (siteUser) => siteUser.userReactions, {
    nullable: false,
  })
  @JoinColumn({ name: 'siteUserId' })
  siteUser: SiteUser;
}
