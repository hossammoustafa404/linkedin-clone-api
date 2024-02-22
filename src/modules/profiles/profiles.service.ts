import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities';
import { Repository } from 'typeorm';
import { UUID } from 'crypto';
import { SkillsService } from '../skills/skills.service';
import { ProfilesSkillsService } from '../profiles-skills/profiles-skills.service';
import { ApiFeatures } from '../../shared/utils';
import {
  CreateProfileDto,
  FindProfilesQueryDto,
  UpdateProfileDto,
} from './dtos';
import { PublicFilesService } from '../public-files/public-files.service';
import { ImageType } from '../public-files/enums';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly publicFilesService: PublicFilesService,
  ) {}
  async createOne(createProfileDto: CreateProfileDto, userId: UUID) {
    // Create the profile and relate it to the user
    const { firstName, lastName } = createProfileDto;
    const fullName = firstName + ' ' + lastName;

    const {
      raw: [createdProfile],
    } = await this.profileRepository
      .createQueryBuilder()
      .insert()
      .values({
        siteUser: { id: userId },
        ...createProfileDto,
        fullName,
      })
      .returning('id')
      .execute();

    // Find the created profile
    const foundProfile = await this.findOneById(createdProfile.id);

    // Return the created profile
    return foundProfile;
  }

  async findMany(query: FindProfilesQueryDto) {
    // Initialize the query
    const findProfilesQuery = this.profileRepository
      .createQueryBuilder('profile')
      .setFindOptions({
        relations: {
          skills: { skill: true },
          educations: { school: true },
          avatar: true,
          cover: true,
          expriences: true,
        },
      });

    // Add api features
    const apiFeatures = new ApiFeatures(findProfilesQuery, query)
      .search(['fullName'])
      .filter()
      .sort()
      .paginate();

    // Execute the query
    const [foundProfiles, profilesCount] =
      await apiFeatures.sqlQuery.getManyAndCount();

    // Return profiles and thier count
    return {
      profiles: foundProfiles,
      count: profilesCount,
      page: +query?.page || 1,
      limit: +query?.limit || 10,
    };
  }

  async findOneById(profileId: UUID) {
    // Find the profile by id
    const profile = await this.profileRepository
      .createQueryBuilder('profile')
      .setFindOptions({
        relations: {
          skills: { skill: true },
          educations: { school: true },
          expriences: true,
          avatar: true,
          cover: true,
        },
      })
      .where({ id: profileId })
      .getOne();

    if (!profile) {
      throw new NotFoundException('The profile does not exist');
    }

    // Return the profile
    return profile;
  }

  async updateOneById(
    updateProfileDto: UpdateProfileDto,
    currentProfileId: UUID,
  ) {
    // Update the fullName
    const { firstName, lastName } = updateProfileDto;
    let newFullName: any = '';

    let setObj: any = {};
    if (firstName || lastName) {
      newFullName = firstName + ' ' + lastName;
      setObj.fullName = newFullName;
    }
    const { avatarId, coverId, ...rest } = updateProfileDto;

    setObj = { ...setObj, ...rest };

    // Update the profile
    const {
      raw: [updatedProfile],
    } = await this.profileRepository
      .createQueryBuilder()
      .update()
      .set(setObj)
      .where({ id: currentProfileId })
      .returning('*')
      .execute();

    // Find the updated profile
    const foundProfile = await this.findOneById(updatedProfile.id);

    // Add avatar if it is provided
    if (avatarId) {
      if (foundProfile.avatar?.id) {
        await this.publicFilesService.deleteOneImage(foundProfile.avatar.id);
      }

      const avatar = await this.publicFilesService.assignOneEntityToImage(
        avatarId,
        {
          id: foundProfile.id,
          name: 'avatarProfile',
        },
      );

      if (avatar) {
        foundProfile.avatar = avatar;
      } else {
        foundProfile.avatar = null;
      }
    }

    // Add cover if it is provided
    if (coverId) {
      if (foundProfile.cover?.id) {
        await this.publicFilesService.deleteOneImage(foundProfile.cover.id);
      }

      const cover = await this.publicFilesService.assignOneEntityToImage(
        coverId,
        {
          id: updatedProfile.id,
          name: 'coverProfile',
        },
      );
      if (cover) {
        foundProfile.cover = cover;
      } else {
        foundProfile.cover = null;
      }
    }

    // Return the found updated Profile
    return foundProfile;
  }
}
