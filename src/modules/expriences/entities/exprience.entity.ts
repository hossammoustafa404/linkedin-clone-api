import { CustomBaseEntity } from '../../../shared/database/entities';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { EmploymentType, LocationType } from '../enums';
import { Profile } from '../../../modules/profiles/entities';

@Entity()
export class Exprience extends CustomBaseEntity {
  @Column()
  title: string;

  @Column({ enum: EmploymentType })
  employmentType: EmploymentType;

  @Column()
  companyName: string;

  @Column()
  location: string;

  @Column({ enum: LocationType })
  locationType: LocationType;

  @Column()
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column()
  industry: string;

  @Column()
  description: string;

  @ManyToOne((type) => Profile, (profile) => profile.expriences, {
    nullable: false,
  })
  @JoinColumn({ name: 'profileId' })
  profile: Profile;
}
