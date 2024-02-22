import { UserReaction } from '../../../modules/user-reactions/entities';
import { Post } from '../../../modules/posts/entities';
import { SiteUser } from '../../../modules/users/entities';
import { CustomBaseEntity } from '../../../shared/database/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { PublicImage, PublicVideo } from '../../public-files/entities';

@Entity()
export class Comment extends CustomBaseEntity {
  @Column()
  content: string;

  @ManyToOne((type) => SiteUser, (siteUser) => siteUser.comments, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'autherId' })
  author: SiteUser;

  @ManyToOne((type) => Post, (post) => post.comments, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'postId' })
  post: Post;

  @ManyToOne((type) => Comment, (comment) => comment.parent, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parentId' })
  parent: Comment;

  @OneToMany((type) => UserReaction, (userReaction) => userReaction.comment)
  userReactions: UserReaction[];

  @OneToOne((type) => PublicImage, (image) => image.comment)
  image: PublicImage;

  @OneToOne((type) => PublicVideo, (video) => video.comment)
  video: PublicVideo;
}
