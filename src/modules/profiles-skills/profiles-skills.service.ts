import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileSkill } from './entities';
import { Repository } from 'typeorm';
import { UUID } from 'crypto';
import { CreateSkillDto } from './dtos';
import { SkillsService } from '../skills/skills.service';

@Injectable()
export class ProfilesSkillsService {
  constructor(
    @InjectRepository(ProfileSkill)
    private readonly profileSkillRepository: Repository<ProfileSkill>,
    private readonly skillsService: SkillsService,
  ) {}

  async createOneSkill(createSkillDto: CreateSkillDto, currentProfileId: UUID) {
    // Create the skill
    const createdSkill = await this.skillsService.createOne(createSkillDto);

    // Check that the profile does not have the skill
    const searchedProfileSkill = await this.findOneSkill(
      currentProfileId,
      createdSkill.id,
    );

    if (searchedProfileSkill) {
      throw new ConflictException('The profile has already the skill');
    }

    // Create the profile skill
    const {
      raw: [createdProfileSkill],
    } = await this.profileSkillRepository
      .createQueryBuilder()
      .insert()
      .values({
        profile: { id: currentProfileId },
        skill: { id: createdSkill.id },
      })
      .returning('*')
      .execute();

    // Find the created profile skill
    const foundProfileSkill = await this.findOneSkill(
      currentProfileId,
      createdSkill.id,
    );

    // Return the found created profile skill
    return foundProfileSkill;
  }

  async findManySkills(profileId: UUID) {
    // Find many profile skills
    const [profileSkills, count] = await this.profileSkillRepository
      .createQueryBuilder()
      .where({ profileId })
      .setFindOptions({ relations: { skill: true } })
      .getManyAndCount();

    // Return the profile skills and thier count
    return { profileSkills, count };
  }

  async findOneSkill(profileId: UUID, skillId: UUID) {
    // Find the profile skill
    const profileSkill = await this.profileSkillRepository
      .createQueryBuilder()
      .setFindOptions({
        relations: {
          skill: true,
        },
      })
      .where({ profile: { id: profileId }, skill: { id: skillId } })
      .getOne();

    // Return the profile skill
    return profileSkill;
  }

  async deleteOneSkill(currentProfileId: UUID, skillId: UUID) {
    // Delete the profile skill
    const { affected } = await this.profileSkillRepository
      .createQueryBuilder()
      .delete()
      .where({ profile: { id: currentProfileId }, skill: { id: skillId } })
      .execute();

    // Throw an exception if the profile skill does not exist
    if (!affected) {
      throw new NotFoundException('The skill does not exist in the profile');
    }
  }
}
