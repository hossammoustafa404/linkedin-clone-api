import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Education } from './entities';
import { Repository } from 'typeorm';
import { SchoolsService } from '../schools/schools.service';
import { UUID } from 'crypto';
import {
  CreateEducationDto,
  FindEducationsQueryDto,
  UpdateEducationDto,
} from './dtos';

@Injectable()
export class EducationsService {
  constructor(
    @InjectRepository(Education)
    private readonly educationRepository: Repository<Education>,
    private readonly schoolsService: SchoolsService,
  ) {}

  async createOne(profileId: UUID, createEducationDto: CreateEducationDto) {
    // Create the school
    const school = await this.schoolsService.createOne({
      name: createEducationDto.school,
    });

    // Create the education
    delete createEducationDto.school;
    const {
      raw: [education],
    } = await this.educationRepository
      .createQueryBuilder()
      .insert()
      .values({
        ...createEducationDto,
        school: { id: school.id },
        profile: { id: profileId },
      })
      .returning('*')
      .execute();

    // Find the updated education
    const foundEducation = await this.findOneById(education.id);

    // Return the education
    return foundEducation;
  }

  async findMany(query: FindEducationsQueryDto) {
    const { profileId } = query;

    // Initialize the sql query
    const findManyQuery = this.educationRepository
      .createQueryBuilder()
      .setFindOptions({ relations: { school: true } });

    // Add filter by profile id to the sql query
    findManyQuery.where({ profile: { id: profileId } });
    delete query.profileId;

    // Find many educations and their count
    const [educations, count] = await findManyQuery.getManyAndCount();

    // Return the educations and thier count
    return { count, educations };
  }

  async findOneById(educationId: UUID) {
    // Find the education
    const education = await this.educationRepository
      .createQueryBuilder()
      .setFindOptions({ relations: { school: true, profile: true } })
      .where({ id: educationId })
      .getOne();

    // Throw a not found exception if the education does not exist
    if (!education) {
      throw new NotFoundException('The Education does not exist');
    }

    // Return the education
    return education;
  }

  async updateOneById(
    educationId: UUID,
    updateEducationDto: UpdateEducationDto,
    currentProfileId: UUID,
  ) {
    // Check the abitity of the current user to update the education
    const education = await this.findOneById(educationId);
    if (currentProfileId !== education.profile.id) {
      throw new UnauthorizedException(
        'User cannot update a education of another one',
      );
    }

    let toUpdateValues: any = {};

    // Update the school if it exist
    if (updateEducationDto.school) {
      const updatedSchool = await this.schoolsService.createOne({
        name: updateEducationDto.school,
      });

      toUpdateValues.school = { id: updatedSchool.id };
    }

    delete updateEducationDto.school;
    toUpdateValues = { ...toUpdateValues, ...updateEducationDto };

    // Update the education
    const {
      raw: [updatedEducation],
    } = await this.educationRepository
      .createQueryBuilder()
      .update()
      .set(toUpdateValues)
      .where({ id: educationId })
      .returning('*')
      .execute();

    // Find the updated education
    const foundEducation = await this.findOneById(updatedEducation.id);

    // Return the updated education
    return foundEducation;
  }

  async deleteOneById(educationId: UUID, currentProfileId: UUID) {
    // Check the abitity of the current user to update the education
    const education = await this.findOneById(educationId);

    if (currentProfileId !== education.profile.id) {
      throw new UnauthorizedException(
        'User cannot update a education of another one',
      );
    }

    // Delete the education
    await this.educationRepository
      .createQueryBuilder()
      .delete()
      .where({ id: educationId })
      .execute();
  }
}
