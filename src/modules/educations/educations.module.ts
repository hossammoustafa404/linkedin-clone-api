import { Module } from '@nestjs/common';
import { EducationsService } from './educations.service';
import { EducationsController } from './educations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Education } from './entities';
import { SchoolsModule } from '../schools/schools.module';

@Module({
  imports: [TypeOrmModule.forFeature([Education]), SchoolsModule],
  controllers: [EducationsController],
  providers: [EducationsService],
  exports: [],
})
export class EducationsModule {}
