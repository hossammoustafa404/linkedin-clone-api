import { UserReaction } from '../../../modules/user-reactions/entities';
import { CustomBaseEntity } from '../../../shared/database/entities';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Reaction extends CustomBaseEntity {
  @Column({ unique: true })
  name: string;

  @OneToMany((type) => UserReaction, (userReaction) => userReaction.reaction)
  postReactions: UserReaction[];
}
