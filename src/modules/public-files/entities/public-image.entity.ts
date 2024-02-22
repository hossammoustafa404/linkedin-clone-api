import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { PublicFile } from './public-file.entity';
import { SiteUser } from 'src/modules/users/entities';
import { ImageType } from '../enums';
import { Profile } from '../../profiles/entities';
import { Post } from '../../posts/entities';
import { Comment } from '../../comments/entities';

@Entity('publicImage')
export class PublicImage extends PublicFile {
  @Column({ enum: ImageType })
  type: ImageType;

  @OneToOne((type) => Profile, (profile) => profile.avatar, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'avatarProfileId' })
  avatarProfile: Profile;

  @OneToOne((type) => Profile, (profile) => profile.cover, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'coverProfileId' })
  coverProfile: Profile;

  @OneToOne((type) => Comment, (comment) => comment.image, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'commentId' })
  comment: Comment;

  @ManyToOne((type) => Post, (post) => post.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: Post;
}
