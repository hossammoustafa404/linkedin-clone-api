import { UserReaction } from '../../../modules/user-reactions/entities';
import { Comment } from '../../../modules/comments/entities';
import { SiteUser } from '../../../modules/users/entities';
import { CustomBaseEntity } from '../../../shared/database/entities';
import { Column, Entity, JoinTable, ManyToOne, OneToMany } from 'typeorm';
import { PublicImage, PublicVideo } from '../../public-files/entities';

@Entity()
export class Post extends CustomBaseEntity {
  @Column({ default: '' })
  content: string;

  @ManyToOne((type) => SiteUser, (siteUser) => siteUser.posts, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinTable({ name: 'ownerId' })
  owner: SiteUser;

  @OneToMany((type) => Comment, (comment) => comment.post)
  comments: Comment[];

  @OneToMany((type) => UserReaction, (userReaction) => userReaction.post)
  userReactions: UserReaction[];

  @OneToMany((type) => PublicImage, (image) => image.post)
  images: PublicImage[];

  @OneToMany((type) => PublicVideo, (video) => video.post)
  videos: PublicVideo[];
}
