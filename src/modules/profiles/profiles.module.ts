import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entities';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { SkillsModule } from '../skills/skills.module';
import { ProfilesSkillsModule } from '../profiles-skills/profiles-skills.module';
import { PublicFilesModule } from '../public-files/public-files.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile]),
    SkillsModule,
    ProfilesSkillsModule,
    PublicFilesModule,
  ],
  controllers: [ProfilesController],
  providers: [ProfilesService],
  exports: [ProfilesService],
})
export class ProfilesModule {}
