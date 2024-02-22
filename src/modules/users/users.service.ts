import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateUserDto,
  UpdateMeDto,
  UpdateUserDto,
  FindUsersQueryDto,
} from './dtos';
import { ApiFeatures, hash } from '../../shared/utils';
import { InjectRepository } from '@nestjs/typeorm';
import { SiteUser } from './entities/site-user.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { PostgresErrorCodes } from '../../shared/database/enums';

import { UUID } from 'crypto';
import { ProfilesService } from '../profiles/profiles.service';
import { PublicFilesService } from '../public-files/public-files.service';
import { UserRole } from './enums';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(SiteUser) private userRepository: Repository<SiteUser>,
    private readonly profilesService: ProfilesService,
    private readonly publicFilesService: PublicFilesService,
  ) {}

  async createOne(createUserDto: CreateUserDto) {
    try {
      const { email, username, password, firstName, lastName } = createUserDto;

      // Hash password
      const hashedPass = await hash(password);

      // Create user
      const { raw } = await this.userRepository
        .createQueryBuilder('user')
        .insert()
        .values({
          email,
          username,
          password: hashedPass,
        })
        .returning('*')
        .execute();

      // Create the profile
      const profile = await this.profilesService.createOne(
        {
          firstName,
          lastName,
        },
        raw[0].id,
      );

      return { ...raw[0], profile };
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.driverError.code === PostgresErrorCodes.UniqueViolation) {
          throw new ConflictException(error.driverError.detail);
        }
      }
      throw error;
    }
  }

  async findMany(query: FindUsersQueryDto) {
    // Initialize find users sql query
    const findUsersSqlQuery = this.userRepository
      .createQueryBuilder('siteUser')
      .setFindOptions({
        relations: {
          profile: {
            skills: { skill: true },
            educations: { school: true },
            avatar: true,
            cover: true,
            expriences: true,
          },
        },
      })
      .addSelect('siteUser.email');
    // .orderBy('siteUser.createdAt', 'ASC');

    // Add api features
    const apiFeatures = new ApiFeatures(findUsersSqlQuery, query)
      .filter()
      .search(['email', 'username'])
      .sort()
      .paginate();

    // Get users and thier count
    const [foundUsers, totalCount] =
      await apiFeatures.sqlQuery.getManyAndCount();

    // Return users with pagination data
    return {
      users: foundUsers,
      totalCount,
      page: query?.page || 1,
      limit: query?.limit || 10,
    };
  }

  async findOneById(userId: UUID, currentUser?: SiteUser) {
    const foundSiteUser = await this.userRepository
      .createQueryBuilder('siteUser')
      .setFindOptions({
        relations: {
          profile: {
            skills: { skill: true },
            educations: { school: true },
            avatar: true,
            cover: true,
            expriences: true,
          },
        },
      })
      .where({ id: userId })
      .getOne();

    // Check that the found user is the current user or a super admin
    if (currentUser?.id && foundSiteUser.id !== currentUser.id) {
      if (currentUser.role !== UserRole.SuperAdmin) {
        console.log('Hello');

        throw new ForbiddenException('Only super admin can get another user');
      }
    }
    // Return user
    return foundSiteUser;
  }

  async findOneByEmail(
    email: string,
    options?: { selectEmail?: boolean; selectPassword?: boolean },
  ) {
    // Find user
    const findUserQuery = this.userRepository
      .createQueryBuilder('user')
      .setFindOptions({
        relations: {
          profile: {
            skills: { skill: true },
            educations: { school: true },
            avatar: true,
            cover: true,
            expriences: true,
          },
        },
      })
      .where({ email });

    if (options?.selectEmail) {
      findUserQuery.addSelect('user.email');
    }

    if (options?.selectPassword) {
      findUserQuery.addSelect('user.password');
    }

    const user = findUserQuery.getOne();

    // Return user if it exist
    return user;
  }
  async updateOneById(
    userId: string,
    updateMeDto?: UpdateMeDto,
    updateUserDto?: UpdateUserDto,
  ) {
    // Hash the password if it exist
    if (updateMeDto?.password) {
      updateMeDto.password = await hash(updateMeDto?.password);
    }

    // Update user
    const setValues = updateMeDto ? updateMeDto : updateUserDto;
    const {
      raw: [updatedUser],
    } = await this.userRepository
      .createQueryBuilder()
      .update()
      .set(setValues)
      .where({ id: userId })
      .returning('id')
      .execute();

    // Throw an error if user does not exist
    if (!updatedUser) {
      throw new NotFoundException('User does not exist');
    }

    // Find the updated user
    const foundUser = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.email')
      .setFindOptions({
        relations: {
          profile: {
            skills: { skill: true },
            educations: { school: true },
            avatar: true,
            cover: true,
            expriences: true,
          },
        },
      })
      .where({ id: userId })
      .getOne();

    // Return found updated user
    return foundUser;
  }

  async deleteOneById(userId: string) {
    // Delete user
    const result = await this.userRepository
      .createQueryBuilder()
      .delete()
      .where({ id: userId })
      .execute();

    // Throw an error if user does not exist
    if (result.affected === 0) {
      throw new NotFoundException('User does not exist');
    }

    // Return result
    return result;
  }
}
