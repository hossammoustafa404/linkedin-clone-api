import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ConnectionStatus } from '../enums';
import { SiteUser } from '../../../modules/users/entities';
import { CustomBaseEntity } from '../../../shared/database/entities';
import { UUID } from 'crypto';

@Entity()
export class Connection extends CustomBaseEntity {
  @Column({ enum: ConnectionStatus, default: ConnectionStatus.Pending })
  status: ConnectionStatus;

  @ManyToOne((type) => SiteUser, (siteUser) => siteUser.sentConnections, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'senderId' })
  sender: SiteUser;

  @ManyToOne((type) => SiteUser, (siteUser) => siteUser.recievedConnections, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'recieverId' })
  reciever: SiteUser;
}
