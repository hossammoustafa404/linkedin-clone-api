import { ConfigService } from '@nestjs/config';
import { SiteUser } from '../../modules/users/entities';
import { RefreshToken } from '../../modules/auth/entities';
import { Profile } from '../../modules/profiles/entities/profile.entity';
import { ProfileSkill, Skill } from '../../modules/skills/entities';
import { Education } from '../../modules/educations/entities';
import { School } from '../../modules/schools/entities';
import { Connection } from '../../modules/connections/entities';
import { Post } from '../../modules/posts/entities';
import { PublicImage, PublicVideo } from '../../modules/public-files/entities';
import { Comment } from '../../modules/comments/entities';
import { Reaction } from '../../modules/reactions/entities';
import { UserReaction } from '../../modules/user-reactions/entities';
import { Exprience } from '../../modules/expriences/entities';
import {
  Notification,
  RecieverNotification,
} from '../../modules/notifications/entities';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { InitDatabase1708598349370 } from './migrations/1708598349370-InitDatabase';

dotenv.config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('POSTGRES_HOST'),
  port: configService.get('POSTGRES_PORT'),
  username: configService.get('POSTGRES_USER'),
  password: configService.get('POSTGRES_PASSWORD'),
  database: configService.get('POSTGRES_NAME'),
  synchronize: configService.get('NODE_ENV') === 'development' ? true : false,
  entities: [
    SiteUser,
    RefreshToken,
    Profile,
    Skill,
    School,
    ProfileSkill,
    Education,
    Exprience,
    Connection,
    Post,
    Comment,
    Reaction,
    UserReaction,
    PublicImage,
    PublicVideo,
    Notification,
    RecieverNotification,
  ],
  migrations: [InitDatabase1708598349370],
});
