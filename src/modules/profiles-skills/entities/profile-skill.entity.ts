import { Profile } from '../../profiles/entities';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Skill } from '../../skills/entities/skill.entity';
import { UUID } from 'crypto';

@Entity({ name: 'profileSkill' })
export class ProfileSkill {
  @PrimaryColumn({ unique: false })
  profileId: UUID;

  @PrimaryColumn({ unique: false })
  skillId: UUID;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne((type) => Profile, (profile) => profile.skills, {
    nullable: false,
  })
  @JoinColumn({ name: 'profileId' })
  profile: Profile;

  @ManyToOne((type) => Skill, (skill) => skill.profiles, {
    nullable: false,
  })
  @JoinColumn({ name: 'skillId' })
  skill: Skill;
}
