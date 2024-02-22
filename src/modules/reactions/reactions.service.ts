import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reaction } from './entities';
import { Repository } from 'typeorm';
import { CreateReactionDto, UpdateReactionDto } from './dtos';
import { UUID } from 'crypto';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectRepository(Reaction)
    private readonly reactionRepository: Repository<Reaction>,
  ) {}

  async createOne(createReactionDto: CreateReactionDto) {
    // Check that the reaction does not exist before
    const foundReaction = await this.findOneByName(createReactionDto.name);

    if (foundReaction) {
      throw new ConflictException('The reaction name is already exist');
    }

    // Create the reaction
    const {
      raw: [createdReaction],
    } = await this.reactionRepository
      .createQueryBuilder()
      .insert()
      .values(createReactionDto)
      .returning('*')
      .execute();

    // Return the reaction
    return createdReaction;
  }

  async findOneByName(reactionName: string) {
    // Find the reaction
    const foundReaction = await this.reactionRepository
      .createQueryBuilder()
      .where({ name: reactionName })
      .getOne();

    // Return the found reaction
    return foundReaction;
  }

  async findMany() {
    // Find the reactions and their count
    const [foundReactions, reactionsCount] = await this.reactionRepository
      .createQueryBuilder()
      .getManyAndCount();

    // Return the reactions and their count
    return { reactions: foundReactions, count: reactionsCount };
  }

  async findOneById(reactionId: UUID) {
    // Find the reaction
    const foundReaction = await this.reactionRepository
      .createQueryBuilder()
      .where({ id: reactionId })
      .getOne();

    // Throw a not found exception if the reaction does not exist
    if (!foundReaction) {
      throw new NotFoundException('The reaction does not exist');
    }
    // Return the found reaction
    return foundReaction;
  }

  async updateOneById(reactionId: UUID, updateReactionDto: UpdateReactionDto) {
    // Update the reaction
    const {
      raw: [updatedReaction],
    } = await this.reactionRepository
      .createQueryBuilder()
      .update()
      .set(updateReactionDto)
      .where({ id: reactionId })
      .returning('*')
      .execute();

    // Return the updated reaction
    return updatedReaction;
  }

  async deleteOneById(reactionId: UUID) {
    // Delete the reaction
    const { affected } = await this.reactionRepository
      .createQueryBuilder()
      .delete()
      .where({ id: reactionId })
      .execute();

    // Throw a not found exception if the reaction does not exist
    if (!affected) {
      throw new NotFoundException('The reaction does not exist');
    }
  }
}
