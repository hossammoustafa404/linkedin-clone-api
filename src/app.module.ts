import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import configs from './shared/config';
import { DatabaseModule } from './shared/database/database.module';
import { UsersModule } from './modules/users/users.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { AuthModule } from './modules/auth/auth.module';
import { SkillsModule } from './modules/skills/skills.module';
import { ProfilesSkillsModule } from './modules/profiles-skills/profiles-skills.module';
import { EducationsModule } from './modules/educations/educations.module';
import { SchoolsModule } from './modules/schools/schools.module';
import { ConnectionsModule } from './modules/connections/connections.module';
import { PostsModule } from './modules/posts/posts.module';
import { PublicFilesModule } from './modules/public-files/public-files.module';
import { SupabaseModule } from './shared/supabase/supabse.module';
import { CommentsModule } from './modules/comments/comments.module';
import { ReactionsModule } from './modules/reactions/reactions.module';
import { UserReactionsModule } from './modules/user-reactions/user-reactions.module';
import { ExpriencesModule } from './modules/expriences/expriences.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 1000, limit: 10 }]),
    ConfigModule.forRoot({
      load: configs,
      isGlobal: true,
      cache: true,
      envFilePath: '.env',
      expandVariables: true,
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    ProfilesModule,
    SkillsModule,
    ProfilesSkillsModule,
    EducationsModule,
    SchoolsModule,
    ConnectionsModule,
    PostsModule,
    PublicFilesModule,
    SupabaseModule,
    CommentsModule,
    ReactionsModule,
    UserReactionsModule,
    ExpriencesModule,
    NotificationsModule,
  ],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
