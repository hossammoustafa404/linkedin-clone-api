import { UUID } from 'crypto';
import { SiteUser } from '../../users/entities';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Notification } from './notification.entity';

@Entity({ name: 'recievedNotification' })
export class RecieverNotification {
  @PrimaryColumn({ unique: false })
  recieverId: UUID;

  @PrimaryColumn({ unique: false })
  notificationId: UUID;

  @ManyToOne((type) => SiteUser, (siteUser) => siteUser.recievedNotifications, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'recieverId' })
  reciever: SiteUser;

  @ManyToOne((type) => Notification, (notification) => notification.recievers)
  @JoinColumn({ name: 'notificationId' })
  notification: Notification;
}
