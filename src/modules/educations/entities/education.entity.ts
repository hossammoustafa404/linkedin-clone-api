import { School } from '../../../modules/schools/entities';
import { Profile } from '../../../modules/profiles/entities';
import { CustomBaseEntity } from '../../../shared/database/entities';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Education extends CustomBaseEntity {
  @Column()
  degree: string;

  @Column()
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column()
  grade: string;

  @ManyToOne((type) => Profile, (profile) => profile.educations, {
    nullable: false,
  })
  @JoinColumn({ name: 'profileId' })
  profile: Profile;

  @ManyToOne((type) => School, (school) => school.educations, {
    nullable: false,
  })
  @JoinColumn({ name: 'schoolId' })
  school: School;
}
