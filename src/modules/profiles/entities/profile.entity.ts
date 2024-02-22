import { Exprience } from '../../../modules/expriences/entities';
import { Education } from '../../../modules/educations/entities';
import { ProfileSkill } from '../../../modules/skills/entities';
import { SiteUser } from '../../../modules/users/entities';
import { CustomBaseEntity } from '../../../shared/database/entities';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  Unique,
} from 'typeorm';
import { Gender } from '../enums';
import { PublicImage } from '../../../modules/public-files/entities';

@Entity()
export class Profile extends CustomBaseEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  @Index()
  fullName: string;

  @Column({ nullable: true, enum: Gender })
  gender?: Gender;

  @Column({ nullable: true })
  dateOfBirth?: Date;

  @Column({ nullable: true })
  headline?: string;

  @Column({ nullable: true })
  summary?: string;

  @Column({ nullable: true })
  website?: string;

  @OneToOne((type) => PublicImage, (avatar) => avatar.avatarProfile)
  avatar?: PublicImage;

  @OneToOne((type) => PublicImage, (cover) => cover.coverProfile)
  cover?: PublicImage;

  @OneToOne((type) => SiteUser, (siteUser) => siteUser.profile, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'siteUserId' })
  siteUser: SiteUser;

  @OneToMany((type) => ProfileSkill, (profileSkill) => profileSkill.profile)
  skills: ProfileSkill[];

  @OneToMany((type) => Education, (education) => education.profile)
  educations: Education[];

  @OneToMany((type) => Exprience, (exprience) => exprience.profile)
  expriences: Exprience[];
}
