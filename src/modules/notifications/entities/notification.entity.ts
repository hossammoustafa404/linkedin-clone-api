import { CustomBaseEntity } from '../../../shared/database/entities';
import { Column, Entity, JoinTable, ManyToOne, OneToMany } from 'typeorm';
import { RecordAction, EntityEnum } from '../enums';
import { SiteUser } from '../../../modules/users/entities';
import { RecieverNotification } from './reciever-notification';

@Entity()
export class Notification extends CustomBaseEntity {
  @Column({ enum: EntityEnum })
  entity: EntityEnum;

  // @Column()
  // recordId: UUID;
  @Column()
  message: string;

  // @Column({ enum: RecordAction })
  // action: RecordAction;

  @ManyToOne((type) => SiteUser, (siteUser) => siteUser.sentNotifications, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinTable({ name: 'senderId' })
  sender: SiteUser;

  @OneToMany(
    (type) => RecieverNotification,
    (reciever) => reciever.notification,
  )
  recievers: RecieverNotification[];
}
