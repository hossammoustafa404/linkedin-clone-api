import { CustomBaseEntity } from '../../../shared/database/entities';
import { SiteUser } from '../../users/entities';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'refreshToken' })
export class RefreshToken extends CustomBaseEntity {
  @Column()
  token: string;

  @ManyToOne((type) => SiteUser, (siteUser) => siteUser.refreshTokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  siteUser: SiteUser;
}
