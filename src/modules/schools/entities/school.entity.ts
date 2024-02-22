import { Education } from '../../../modules/educations/entities';
import { CustomBaseEntity } from '../../../shared/database/entities';
import { Column, Entity, OneToMany, Unique } from 'typeorm';

@Entity()
@Unique('unique_school_name', ['name'])
export class School extends CustomBaseEntity {
  @Column()
  name: string;

  @OneToMany((type) => Education, (education) => education.school)
  educations: Education[];
}
