import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { School } from './entities';
import { Repository } from 'typeorm';
import { CreateSchoolDto, FindSchoolsQueryDto } from './dtos';
import { ApiFeatures } from '../../shared/utils';

@Injectable()
export class SchoolsService {
  constructor(
    @InjectRepository(School)
    private readonly schoolRepository: Repository<School>,
  ) {}

  async createOne(createSchoolDto: CreateSchoolDto) {
    // Create the school (update it on name conflict)
    const {
      raw: [school],
    } = await this.schoolRepository
      .createQueryBuilder()
      .insert()
      .values(createSchoolDto)
      .orUpdate(['name'], 'unique_school_name')
      .returning('*')
      .execute();

    // Return the school
    return school;
  }

  async findMany(query: FindSchoolsQueryDto) {
    // Initialize the sql query
    const findShoolsSqlQuery = this.schoolRepository.createQueryBuilder();

    // Add api features to the sql query
    const apiFeatures = new ApiFeatures(findShoolsSqlQuery, query).filter();

    // Execute the sql query
    const [foundSchools, totalCount] =
      await apiFeatures.sqlQuery.getManyAndCount();

    // Return the schools and thier counts
    return { schools: foundSchools, totalCount };
  }
}
