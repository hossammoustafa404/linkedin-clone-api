import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities';
import { PublicFilesModule } from '../public-files/public-files.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), PublicFilesModule],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
