import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification, RecieverNotification } from './entities';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dtos';
import { UUID } from 'crypto';
import { UsersService } from '../users/users.service';
import { FindNotificationsQueryDto } from './dtos';
import { ApiFeatures } from '../../shared/utils';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(RecieverNotification)
    private readonly recieverNotificationRepository: Repository<RecieverNotification>,
    private readonly usersService: UsersService,
  ) {}

  async createOne(
    createNotificationDto: CreateNotificationDto,
    currentUserId: UUID,
  ) {
    // Hold the recievers ids
    const recieversIds = createNotificationDto.recieversIds;
    delete createNotificationDto.recieversIds;

    // Create the notification
    const {
      raw: [createdNotification],
    } = await this.notificationRepository
      .createQueryBuilder()
      .insert()
      .values({ ...createNotificationDto, sender: { id: currentUserId } })
      .returning('id')
      .execute();

    // Create many reciever notification
    const insertValues = recieversIds.map((recieverId) => ({
      notification: { id: createdNotification.id },
      reciever: { id: recieverId },
    }));

    await this.recieverNotificationRepository
      .createQueryBuilder()
      .insert()
      .values(insertValues)
      .returning('*')
      .execute();

    // Find the created notification
    const foundNotification = await this.findOneNotificationById(
      createdNotification.id,
    );

    // Return the found created notification
    return foundNotification;
  }

  async findOneNotificationById(notificationId: UUID) {
    // Find the notification
    const foundNotification = await this.notificationRepository
      .createQueryBuilder()
      .setFindOptions({
        relations: { recievers: { reciever: { profile: true } } },
      })
      .where({ id: notificationId })
      .getOne();

    // Return the notification
    return foundNotification;
  }
  async findOneRecievedNotification(notificationId: UUID, recieverId: UUID) {
    // Find the recieved notification
    const foundRecievedNotification = await this.recieverNotificationRepository
      .createQueryBuilder()
      .setFindOptions({
        relations: {
          notification: { sender: { profile: true } },
          reciever: { profile: true },
        },
      })
      .where({
        reciever: { id: recieverId },
        notification: { id: notificationId },
      })
      .getOne();

    // Return the recieved notification
    return foundRecievedNotification;
  }

  async findMany(query: FindNotificationsQueryDto, currentUserId: UUID) {
    // Initialize the sql query
    const findNotificationsSqlQuery = this.recieverNotificationRepository
      .createQueryBuilder("notification")
      .setFindOptions({
        relations: {
          notification: { sender: { profile: true } },
          reciever: { profile: true },
        },
      })
      .where({ reciever: { id: currentUserId } });

    // Add api features
    const apiFeatures = new ApiFeatures(findNotificationsSqlQuery, query)
      .filter()
      .sort()
      .paginate();

    // Execute the query
    const [foundNotifications, notificationsCount] =
      await apiFeatures.sqlQuery.getManyAndCount();

    // Return the notifications with pagination data
    return {
      notifications: foundNotifications,
      totalCount: notificationsCount,
      page: query?.page || 1,
      limit: query?.limit || 10,
    };
  }

  async deleteOneByCompositeId(notificationId: UUID, currentUserId: UUID) {
    // Delete the recieved notification
    const { affected } = await this.recieverNotificationRepository
      .createQueryBuilder()
      .delete()
      .where({
        notification: { id: notificationId },
        reciever: { id: currentUserId },
      })
      .execute();

    // Throw a not found exception if the recieved notification does not exist
    if (!affected) {
      throw new NotFoundException('The recieved notification does not exist');
    }
  }
}
