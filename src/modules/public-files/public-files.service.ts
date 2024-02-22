import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PublicImage, PublicVideo } from './entities';
import { Repository } from 'typeorm';
import { UUID } from 'crypto';
import { SupabaseService } from '../../shared/supabase/supabase.service';
import { ImageType, VideoType } from './enums';
import { SiteUser } from '../users/entities';

@Injectable()
export class PublicFilesService {
  constructor(
    @InjectRepository(PublicImage)
    private readonly publicImageRepository: Repository<PublicImage>,
    @InjectRepository(PublicVideo)
    private readonly publicVideoRepository: Repository<PublicVideo>,
    private readonly supabaseService: SupabaseService,
  ) {}

  async uploadOneImage(
    file: Express.Multer.File,
    folder: string,
    imageType: ImageType,
  ) {
    // Upload the image to the cloud
    const { path, publicUrl } = await this.supabaseService.uploadOneFile(
      file,
      folder,
    );

    // Save the image into my own database
    const {
      raw: [savedImage],
    } = await this.publicImageRepository
      .createQueryBuilder()
      .insert()
      .values({ path, publicUrl, type: imageType })
      .returning('*')
      .execute();

    // Return the saved image
    return savedImage;
  }

  async deleteOneImage(imageId: UUID, currentUser?: SiteUser) {
    // Find the image by id
    const searchedImage = await this.findOneImageById(imageId);

    // Throw a not found exception if the image does not exist
    if (!searchedImage) {
      throw new NotFoundException('The image does not exist');
    }

    // Check the ability of the current user to delete the image based on the image type
    if (currentUser) {
      switch (searchedImage.type) {
        case ImageType.Avatar:
          if (searchedImage.avatarProfile?.id !== currentUser?.profile?.id) {
            throw new UnauthorizedException(
              'The user cannot delete an avatar that belongs to another user',
            );
          }
          break;

        case ImageType.ProfileCover:
          if (searchedImage.coverProfile?.id !== currentUser.profile?.id) {
            throw new UnauthorizedException(
              'The user cannot delete a profile cover that belongs to another user',
            );
          }
          break;

        case ImageType.PostImage:
          if (searchedImage.post.owner.id !== currentUser.id) {
            throw new UnauthorizedException(
              'The user cannot delete a post image that belongs to another user',
            );
          }
          break;

        case ImageType.CommentImage:
          if (searchedImage.comment.author.id !== currentUser.id) {
            throw new UnauthorizedException(
              'The user cannot delete a comment image that belongs to another user',
            );
          }
          break;
      }
    }

    // Delete the image from the cloud
    await this.supabaseService.deleteManyFiles([searchedImage?.path]);

    // Delete the image from my own database
    await this.publicImageRepository
      .createQueryBuilder()
      .delete()
      .where({ id: imageId })
      .execute();
  }

  async findOneImageById(imageId: UUID) {
    // Find the image
    const searchedImage = await this.publicImageRepository
      .createQueryBuilder()
      .where({ id: imageId })
      .getOne();

    // Return the image
    return searchedImage;
  }

  async uploadOneVideo(
    file: Express.Multer.File,
    folder: string,
    videoType: VideoType,
  ) {
    // Upload the video to the cloud
    const { path, publicUrl } = await this.supabaseService.uploadOneFile(
      file,
      folder,
    );

    // Save the video into my own database
    const {
      raw: [savedVideo],
    } = await this.publicVideoRepository
      .createQueryBuilder()
      .insert()
      .values({ path, publicUrl, type: videoType })
      .returning('*')
      .execute();

    // Return the saved video
    return savedVideo;
  }

  async deleteOneVideo(videoId: UUID, currentUser?: SiteUser) {
    // Find the video by id
    const searchedVideo = await this.findOneVideoById(videoId);

    // Throw a not found exception if the video does not exist
    if (!searchedVideo) {
      throw new NotFoundException('The video does not exist');
    }

    // Check the ability of the current user to delete the video based on the video type
    switch (searchedVideo.type) {
      case VideoType.PostVideo:
        if (searchedVideo.post.owner.id !== currentUser.id) {
          throw new UnauthorizedException(
            'The user cannot delete a post video that belongs to another user',
          );
        }
        break;

      case VideoType.CommentVideo:
        if (searchedVideo.comment.author.id !== currentUser.id) {
          throw new UnauthorizedException(
            'The user cannot delete a comment video that belongs to another user',
          );
        }
        break;
    }

    // Delete the video from the cloud
    await this.supabaseService.deleteManyFiles([searchedVideo?.path]);

    // Delete the video from my own database
    await this.publicVideoRepository
      .createQueryBuilder()
      .delete()
      .where({ id: videoId })
      .execute();
  }

  async findOneVideoById(videoId: UUID) {
    // Find the video
    const searchedVideo = await this.publicVideoRepository
      .createQueryBuilder()
      .where({ id: videoId })
      .getOne();

    // Return the video
    return searchedVideo;
  }

  async assignOneEntityToImage(
    imageId: UUID,
    entity: { id: UUID; name: string },
  ) {
    const { id: entityId, name: entityName } = entity;

    const {
      raw: [updatedImage],
    } = await this.publicImageRepository
      .createQueryBuilder()
      .update()
      .set({ [entityName]: { id: entityId } })
      .where({ id: imageId })
      .returning('*')
      .execute();

    return updatedImage;
  }

  async assignOneEntityToManyImages(
    imagesIds: UUID[],
    entity: { id: UUID; name: string },
  ) {
    const { id: entityId, name: entityName } = entity;

    let setConditions = imagesIds.map((imageId) => ({
      id: imageId,
    }));

    const { raw } = await this.publicImageRepository
      .createQueryBuilder()
      .update()
      .set({ [entityName]: entityId })
      .where(setConditions)
      .returning('*')
      .execute();

    return raw;
  }
  async assignOneEntityToVideo(
    videoId: UUID,
    entity: { id: UUID; name: string },
  ) {
    const { id: entityId, name: entityName } = entity;

    const {
      raw: [updatedVideo],
    } = await this.publicVideoRepository
      .createQueryBuilder()
      .update()
      .set({ [entityName]: { id: entityId } })
      .where({ id: videoId })
      .returning('*')
      .execute();

    return updatedVideo;
  }

  async assignOneEntityToManyVideos(
    videosIds: UUID[],
    entity: { id: UUID; name: string },
  ) {
    const { id: entityId, name: entityName } = entity;

    let setConditions = videosIds.map((videoId) => ({
      id: videoId,
    }));

    const { raw } = await this.publicVideoRepository
      .createQueryBuilder()
      .update()
      .set({ [entityName]: entityId })
      .where(setConditions)
      .returning('*')
      .execute();

    return raw;
  }
}
