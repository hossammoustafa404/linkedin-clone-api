import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { PublicFile } from './public-file.entity';
import { ImageType, VideoType } from '../enums';
import { Post } from '../../posts/entities';
import { Comment } from '../../comments/entities';

@Entity('publicVideo')
export class PublicVideo extends PublicFile {
  @Column({ enum: VideoType })
  type: VideoType;

  @OneToOne((type) => Comment, (comment) => comment.video, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'commentId' })
  comment: Comment;

  @ManyToOne((type) => Post, (post) => post.videos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: Post;
}
