import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities';
import { ConnectionsModule } from '../connections/connections.module';
import { PublicFilesModule } from '../public-files/public-files.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    ConnectionsModule,
    PublicFilesModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
