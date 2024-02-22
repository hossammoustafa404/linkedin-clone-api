import { Module } from '@nestjs/common';
import { PostsReactionsController } from './user-reactions.controller';
import { PostsReactionsService } from './user-reactions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserReaction } from './entities';
import { PostsModule } from '../posts/posts.module';
import { ReactionsModule } from '../reactions/reactions.module';
import { CommentsModule } from '../comments/comments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserReaction]),
    PostsModule,
    CommentsModule,
    ReactionsModule,
  ],
  controllers: [PostsReactionsController],
  providers: [PostsReactionsService],
})
export class UserReactionsModule {}
