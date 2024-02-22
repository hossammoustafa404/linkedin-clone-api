import { CustomBaseEntity } from '../../../shared/database/entities';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'publicFile' })
export class PublicFile extends CustomBaseEntity {
  @Column()
  path: string;

  @Column()
  publicUrl: string;
}
