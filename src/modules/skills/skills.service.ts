import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileSkill, Skill } from './entities';
import { Repository } from 'typeorm';
import { CreateSkillDto, FindSkillsQueryDto } from './dtos';
import { ApiFeatures } from '../../shared/utils';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
    @InjectRepository(ProfileSkill)
    private readonly profileSkillRepository: Repository<ProfileSkill>,
  ) {}

  async createOne(createSkillDto: CreateSkillDto) {
    // Create the skill
    const {
      raw: [skill],
    } = await this.skillRepository
      .createQueryBuilder()
      .insert()
      .values(createSkillDto)
      .orUpdate(['name'], 'unique_skill_name')
      .returning('*')
      .execute();

    // Return the skill
    return skill;
  }

  async findMany(query: FindSkillsQueryDto) {
    // Initialize the sql query
    const findSkillsSqlQuery = this.skillRepository.createQueryBuilder('skill');

    // Add api features to the sql query
    const apiFeatures = new ApiFeatures(findSkillsSqlQuery, query).filter();

    // Execute the sql query
    const [foundSkills, skillsCount] =
      await apiFeatures.sqlQuery.getManyAndCount();

    // Return the found skills with thier count
    return { skills: foundSkills, totalCount: skillsCount };
  }
}
