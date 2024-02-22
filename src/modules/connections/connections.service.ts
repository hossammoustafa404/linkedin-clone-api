import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection } from './entities';
import { Not, Repository } from 'typeorm';
import {
  CreateConnectionDto,
  FindConnectionsQueryDto,
  FindMyConnectionsQueryDto,
  UpdateConnectionDto,
} from './dtos';
import { UUID } from 'crypto';
import { ConnectionStatus, ConnectionType } from './enums';
import { UsersService } from '../users/users.service';
import { ApiFeatures } from '../../shared/utils';

@Injectable()
export class ConnectionsService {
  constructor(
    @InjectRepository(Connection)
    private readonly connectionRepository: Repository<Connection>,
    private readonly usersService: UsersService,
  ) {}

  async createOne(
    currentUserId: UUID,
    createConnectionDto: CreateConnectionDto,
  ) {
    // Check that user does not send request to herself
    const { recieverId } = createConnectionDto;
    if (currentUserId === recieverId) {
      throw new ForbiddenException(
        'The user cannot send a connection to herself',
      );
    }

    // Check that the reciever exists
    const foundReciever = await this.usersService.findOneById(recieverId);
    if (!foundReciever) {
      throw new NotFoundException('The reciever does not exist');
    }

    // Check that the connection does not exist
    const searchedConnection = await this.findOneConnection(
      currentUserId,
      recieverId,
    );

    if (searchedConnection) {
      throw new ConflictException(
        'The connection is already exist either pending or accepted',
      );
    }

    // Create the connection
    const {
      raw: [createdConnection],
    } = await this.connectionRepository
      .createQueryBuilder()
      .insert()
      .values({ sender: { id: currentUserId }, reciever: { id: recieverId } })
      .returning('*')
      .execute();

    // Find the created connection
    const foundConnection = await this.findOneBySenderAndRecieverIds(
      currentUserId,
      recieverId,
    );

    // Return the connection
    return foundConnection;
  }

  async findOneConnection(senderId: UUID, recieverId: UUID) {
    const foundConnection = await this.connectionRepository
      .createQueryBuilder()
      .setFindOptions({ relations: { sender: true, reciever: true } })
      .where([
        { sender: { id: senderId }, reciever: { id: recieverId } },
        { sender: { id: recieverId }, reciever: { id: senderId } },
      ])
      .getOne();

    return foundConnection;
  }

  async findMyConnections(
    currentUserId: UUID,
    query: FindMyConnectionsQueryDto,
  ) {
    // Initialize the sql query
    const findConnectionsSqlQuery = this.connectionRepository
      .createQueryBuilder('connection')
      .setFindOptions({ relations: { sender: true, reciever: true } });

    // Add filter by connection type if it exist
    const { type } = query;
    if (type) {
      if (type === ConnectionType.Sent) {
        findConnectionsSqlQuery.where({ sender: { id: currentUserId } });
      } else if (type === ConnectionType.Recieved) {
        findConnectionsSqlQuery.where({ reciever: { id: currentUserId } });
      }
      delete query.type;
    } else {
      findConnectionsSqlQuery.where([
        { sender: { id: currentUserId } },
        { reciever: { id: currentUserId } },
      ]);
    }

    // Add api features
    const apiFeatures = new ApiFeatures(findConnectionsSqlQuery, query)
      .filter()
      .sort()
      .paginate();

    // Execute the query and return the connections with thier count
    const [foundConnections, totalCount] =
      await apiFeatures.sqlQuery.getManyAndCount();

    // Return the connections with pagination data
    return {
      connections: foundConnections,
      totalCount,
      page: query?.page || 1,
      limit: query?.limit || 10,
    };
  }

  async findMany(query: FindConnectionsQueryDto) {
    // Initialize the sql query
    const { userId } = query;

    const findConnectionsSqlQuery = this.connectionRepository
      .createQueryBuilder('connection')
      .setFindOptions({ relations: { sender: true, reciever: true } })
      .where([{ sender: { id: userId } }, { reciever: { id: userId } }])
      .andWhere({ status: ConnectionStatus.Accepted });

    // Add api features
    const apiFeatures = new ApiFeatures(findConnectionsSqlQuery, query)
      .sort()
      .paginate();

    // Find the connections and thier count
    const [foundConnections, totalCount] =
      await apiFeatures.sqlQuery.getManyAndCount();

    // Return the connections and thier count
    return {
      connections: foundConnections,
      totalCount,
      page: query?.page || 1,
      limit: query?.limit || 10,
    };
  }

  async findOneBySenderAndRecieverIds(senderId: UUID, recieverId: UUID) {
    // Find the connection
    const foundConnection = await this.connectionRepository
      .createQueryBuilder()
      .setFindOptions({ relations: { sender: true, reciever: true } })
      .where({
        sender: { id: senderId },
        reciever: { id: recieverId },
        status: Not(ConnectionStatus.Rejected),
      })
      .getOne();

    // Return the connection
    return foundConnection;
  }

  async findOneById(connectionId: UUID) {
    // Find the connection
    const foundConnection = await this.connectionRepository
      .createQueryBuilder()
      .where({ id: connectionId })
      .setFindOptions({ relations: { sender: true, reciever: true } })
      .getOne();

    // Return the connection
    return foundConnection;
  }

  async updateOneById(
    connectionId: UUID,
    updateConnectionDto: UpdateConnectionDto,
    currentUserId: UUID,
  ) {
    // Find the connection by id
    const searchedConnection = await this.findOneById(connectionId);

    // Throw a not found exception if the connection does not exist
    if (!searchedConnection) {
      throw new NotFoundException('The connection does not exist');
    }

    // Check that the status is pending
    if (searchedConnection.status !== ConnectionStatus.Pending) {
      throw new ForbiddenException('Only pending connections can be updated');
    }

    // Check that the current user is the reciever
    if (currentUserId !== searchedConnection?.reciever?.id) {
      throw new UnauthorizedException(
        'Only the reciever can update the connection',
      );
    }

    // Update the connection
    const {
      raw: [updatedConnection],
    } = await this.connectionRepository
      .createQueryBuilder()
      .update()
      .set(updateConnectionDto)
      .where({ id: connectionId })
      .returning('*')
      .execute();

    // Find the updated connection by id
    const foundConnection = await this.findOneById(updatedConnection?.id);

    // Return the found connection
    return foundConnection;
  }

  async deleteOneById(connectionId: UUID, currentUserId: UUID) {
    // Find the connection by id
    const searchedConnection = await this.findOneById(connectionId);

    // Throw a not found exception if the connection does not exist
    if (!searchedConnection) {
      throw new NotFoundException('The connection does not exist');
    }

    // Check that the current user has the ability to delete the connection
    const {
      sender: { id: senderId },
      reciever: { id: recieverId },
      status: connectionStatus,
    } = searchedConnection;
    if (currentUserId !== senderId && currentUserId !== recieverId) {
      throw new ForbiddenException('User cannot delete the connection');
    }

    // Check that the connection status is accepted
    if (connectionStatus !== ConnectionStatus.Accepted) {
      throw new ForbiddenException('Only accepted connections can be deleted');
    }

    // Delete the connection
    await this.connectionRepository
      .createQueryBuilder()
      .delete()
      .where({ id: connectionId })
      .execute();
  }
}
