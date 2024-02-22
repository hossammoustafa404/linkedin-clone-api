import { CustomBaseEntity } from '../../../shared/database/entities';
import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { ProfileSkill } from '../../profiles-skills/entities/profile-skill.entity';

@Entity()
@Unique('unique_skill_name', ['name'])
export class Skill extends CustomBaseEntity {
  @Column()
  name: string;

  @OneToMany((type) => ProfileSkill, (profileSkill) => profileSkill.skill)
  profiles: ProfileSkill[];
}
