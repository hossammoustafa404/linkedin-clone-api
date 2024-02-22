import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const { host, port, name, user, password } =
          configService.get('database');

        return {
          type: 'postgres',
          host,
          port,
          username: user,
          password,
          database: name,
          synchronize:
            configService.get('app.env') === 'development' ? true : false,
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
          migrations: ['./migrations/*.ts'],
        };
      },
    }),
  ],
})
export class DatabaseModule {}
