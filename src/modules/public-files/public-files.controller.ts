import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  ParseUUIDPipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PublicFilesService } from './public-files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { RequestWithUser } from '../../shared/interfaces';
import { UUID } from 'crypto';
import { JwtAuthGuard } from '../auth/guards';
import { ImageType, VideoType } from './enums';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Public Files')
@Controller('public-files')
export class PublicFilesController {
  constructor(private readonly publicFilesService: PublicFilesService) {}

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiCreatedResponse({
    description: 'The avatar has been successfully uploaded',
  })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: memoryStorage(),
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  @Post('avatars')
  async uploadOneAvatar(
    @UploadedFile(
      new ParseFilePipeBuilder()
        // .addFileTypeValidator({ fileType: 'png' })
        // .addMaxSizeValidator({ maxSize: 5000 })
        .build({ fileIsRequired: false }),
    )
    avatar: Express.Multer.File,
    @Req() req: RequestWithUser,
  ) {
    const uploadedAvatar = await this.publicFilesService.uploadOneImage(
      avatar,
      'avatars',
      ImageType.Avatar,
    );
    return { avatar: uploadedAvatar };
  }

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiCreatedResponse({
    description: 'The profile cover has been successfully uploaded',
  })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('profile-cover', {
      storage: memoryStorage(),
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  @Post('profiles-covers')
  async uploadOneProfileCover(
    @UploadedFile(
      new ParseFilePipeBuilder()
        // .addFileTypeValidator({ fileType: 'png' })
        // .addMaxSizeValidator({ maxSize: 5000 })
        .build({ fileIsRequired: false }),
    )
    profileCover: Express.Multer.File,
    @Req() req: RequestWithUser,
  ) {
    const uploadedProfileCover = await this.publicFilesService.uploadOneImage(
      profileCover,
      'profiles-covers',
      ImageType.ProfileCover,
    );
    return { profileCover: uploadedProfileCover };
  }

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiCreatedResponse({
    description: 'The post image has been successfully uploaded',
  })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('post-image', {
      storage: memoryStorage(),
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  @Post('posts-images')
  async uploadOnePostImage(
    @UploadedFile(
      new ParseFilePipeBuilder()
        // .addFileTypeValidator({ fileType: 'png' })
        // .addMaxSizeValidator({ maxSize: 5000 })
        .build({ fileIsRequired: false }),
    )
    postImage: Express.Multer.File,
    @Req() req: RequestWithUser,
  ) {
    const uploadedPostImage = await this.publicFilesService.uploadOneImage(
      postImage,
      'posts-images',
      ImageType.PostImage,
    );
    return { postImage: uploadedPostImage };
  }

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiCreatedResponse({
    description: 'The comment image has been successfully uploaded',
  })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('comment-image', {
      storage: memoryStorage(),
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  @Post('comments-images')
  async uploadOneCommentImage(
    @UploadedFile(
      new ParseFilePipeBuilder()
        // .addFileTypeValidator({ fileType: 'png' })
        // .addMaxSizeValidator({ maxSize: 5000 })
        .build({ fileIsRequired: false }),
    )
    commentImage: Express.Multer.File,
    @Req() req: RequestWithUser,
  ) {
    const uploadedCommentImage = await this.publicFilesService.uploadOneImage(
      commentImage,
      'comments-images',
      ImageType.CommentImage,
    );
    return { commentImage: uploadedCommentImage };
  }

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiCreatedResponse({
    description: 'The post video has been successfully uploaded',
  })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('post-video', {
      storage: memoryStorage(),
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  @Post('posts-videos')
  async uploadOnePostVideo(
    @UploadedFile(
      new ParseFilePipeBuilder()
        // .addFileTypeValidator({ fileType: 'png' })
        // .addMaxSizeValidator({ maxSize: 5000 })
        .build({ fileIsRequired: false }),
    )
    postVideo: Express.Multer.File,
    @Req() req: RequestWithUser,
  ) {
    const uploadedPostVideo = await this.publicFilesService.uploadOneVideo(
      postVideo,
      'posts-videos',
      VideoType.PostVideo,
    );
    return { postVideo: uploadedPostVideo };
  }

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiCreatedResponse({
    description: 'The comment video has been successfully uploaded',
  })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('comment-video', {
      storage: memoryStorage(),
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  @Post('comments-videos')
  async uploadOneCommentVideo(
    @UploadedFile(
      new ParseFilePipeBuilder()
        // .addFileTypeValidator({ fileType: 'png' })
        // .addMaxSizeValidator({ maxSize: 5000 })
        .build({ fileIsRequired: false }),
    )
    commentVideo: Express.Multer.File,
    @Req() req: RequestWithUser,
  ) {
    const uploadedCommentVideo = await this.publicFilesService.uploadOneVideo(
      commentVideo,
      'comments-videos',
      VideoType.CommentVideo,
    );
    return { commentVideo: uploadedCommentVideo };
  }

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({
    description: 'The image does not exist',
  })
  @ApiNoContentResponse({
    description: 'The image has been successfully deleted',
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('images/:imageId')
  async deleteOneImage(
    @Param('imageId', ParseUUIDPipe) imageId: UUID,
    @Req() reqWithUser: RequestWithUser,
  ) {
    await this.publicFilesService.deleteOneImage(imageId, reqWithUser.user);
  }

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({
    description: 'The video does not exist',
  })
  @ApiNoContentResponse({
    description: 'The video has been successfully deleted',
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('videos/:videoId')
  async deleteOneVideo(
    @Param('videoId', ParseUUIDPipe) videoId: UUID,
    @Req() reqWithUser: RequestWithUser,
  ) {
    await this.publicFilesService.deleteOneVideo(videoId, reqWithUser.user);
  }
}
