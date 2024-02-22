import { Module } from '@nestjs/common';
import { SchoolsService } from './schools.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { School } from './entities';
import { SchoolsController } from './schools.controller';

@Module({
  imports: [TypeOrmModule.forFeature([School])],
  controllers: [SchoolsController],
  providers: [SchoolsService],
  exports: [SchoolsService],
})
export class SchoolsModule {}
