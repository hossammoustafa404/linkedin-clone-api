import { RefreshToken } from '../../auth/entities';
import {
  Entity,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { UserRole } from '../enums/user-role.enum';
import { CustomBaseEntity } from '../../../shared/database/entities';
import { Profile } from '../../../modules/profiles/entities';
import { Connection } from '../../../modules/connections/entities';
import { Post } from '../../../modules/posts/entities';
import { PublicImage } from 'src/modules/public-files/entities';
import { Comment } from '../../../modules/comments/entities';
import { UserReaction } from '../../../modules/user-reactions/entities';
import { Notification } from '../../../modules/notifications/entities';
import { RecieverNotification } from '../../notifications/entities/reciever-notification';

// import { Avatar } from './';

@Entity({ name: 'siteUser' })
export class SiteUser extends CustomBaseEntity {
  @Column({ unique: true, select: false })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column({ select: false })
  password: string;

  @Column({ default: false })
  verified: boolean;

  @Column({ default: UserRole.User })
  role: UserRole;

  @OneToMany((type) => RefreshToken, (refreshToken) => refreshToken.siteUser)
  refreshTokens: RefreshToken[];

  @OneToOne((type) => Profile, (profile) => profile.siteUser)
  profile: Profile;

  @OneToMany((type) => Connection, (connection) => connection.sender)
  sentConnections: Connection[];

  @OneToMany((type) => Connection, (connection) => connection.reciever)
  recievedConnections: Connection[];

  @OneToMany((type) => Post, (post) => post.owner)
  posts: Post[];

  @OneToMany((type) => Comment, (comment) => comment.author)
  comments: Comment[];

  @OneToMany((type) => UserReaction, (userReaction) => userReaction.siteUser)
  userReactions: UserReaction[];

  @OneToMany((type) => Notification, (notification) => notification.sender)
  sentNotifications: Notification[];

  @OneToMany(
    (type) => RecieverNotification,
    (recievedNotification) => recievedNotification.reciever,
  )
  recievedNotifications: RecieverNotification[];
}
