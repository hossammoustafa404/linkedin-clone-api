import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Exprience } from './entities';
import { Repository } from 'typeorm';
import {
  CreateExprienceDto,
  FindExpriencesQueryDto,
  UpdateExprienceDto,
} from './dtos';
import { UUID } from 'crypto';

@Injectable()
export class ExpriencesService {
  constructor(
    @InjectRepository(Exprience)
    private readonly exprienceRepository: Repository<Exprience>,
  ) {}

  async createOne(
    createExprienceDto: CreateExprienceDto,
    currentProfileId: UUID,
  ) {
    // Create the exprience
    const {
      raw: [createdExprience],
    } = await this.exprienceRepository
      .createQueryBuilder()
      .insert()
      .values({ ...createExprienceDto, profile: { id: currentProfileId } })
      .returning('id')
      .execute();

    // Find the created exprience
    const foundExprience = await this.findOneById(createdExprience.id);

    // Return the found created exprience
    return foundExprience;
  }

  async findMany(query: FindExpriencesQueryDto) {
    // Initialize the sql query
    const findManyQuery = this.exprienceRepository
      .createQueryBuilder()
      .setFindOptions({ relations: { profile: true } });

    // Add a filter by profile id
    findManyQuery.where({ profile: { id: query.profileId } });

    // Execute the sql query
    const [foundExpriences, expriencesCount] =
      await findManyQuery.getManyAndCount();

    // Return the expriences with thier count
    return { expriences: foundExpriences, count: expriencesCount };
  }

  async findOneById(exprienceId: UUID) {
    // Find the exprience
    const foundExprience = await this.exprienceRepository
      .createQueryBuilder()
      .setFindOptions({ relations: { profile: true } })
      .where({ id: exprienceId })
      .getOne();

    // Return the exprience
    return foundExprience;
  }

  async updateOneById(
    exprienceId: UUID,
    updateExprienceDto: UpdateExprienceDto,
    currentProfileId: UUID,
  ) {
    // Find the exprience
    const searchedExprience = await this.findOneById(exprienceId);

    // Throw a not found error if the exprience does not exist
    if (!searchedExprience) {
      throw new NotFoundException('The exprience does not exist');
    }

    // Check the ability of current user to update the exprience
    if (searchedExprience.profile.id !== currentProfileId) {
      throw new UnauthorizedException(
        'The user cannot update an exprience belongs to another user',
      );
    }

    // Update the exprience
    const {
      raw: [updatedExprience],
    } = await this.exprienceRepository
      .createQueryBuilder()
      .update()
      .set(updateExprienceDto)
      .where({ id: exprienceId })
      .returning('id')
      .execute();

    // Find the updated exprience
    const foundExprience = await this.findOneById(updatedExprience.id);

    // Return the found updated exprience
    return foundExprience;
  }

  async deleteOneById(exprienceId: UUID, currentProfileId: UUID) {
    // Find the exprience
    const searchedExprience = await this.findOneById(exprienceId);

    // Throw a not found error if the exprience does not exist
    if (!searchedExprience) {
      throw new NotFoundException('The exprience does not exist');
    }

    // Check the ability of current user to delete the exprience
    if (searchedExprience.profile.id !== currentProfileId) {
      throw new UnauthorizedException(
        'The user cannot update an exprience belongs to another user',
      );
    }

    // Delete the exprience
    await this.exprienceRepository
      .createQueryBuilder()
      .delete()
      .where({ id: exprienceId })
      .execute();
  }
}
