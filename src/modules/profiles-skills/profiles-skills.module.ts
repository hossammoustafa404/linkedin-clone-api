import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileSkill } from './entities';
import { ProfilesSkillsService } from './profiles-skills.service';
import { SkillsModule } from '../skills/skills.module';
import { ProfilesSkillsController } from './profiles-skills.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProfileSkill]), SkillsModule],
  controllers: [ProfilesSkillsController],
  providers: [ProfilesSkillsService],
  exports: [ProfilesSkillsService],
})
export class ProfilesSkillsModule {}
