import { Module } from '@nestjs/common';
import { ExpriencesService } from './expriences.service';
import { ExpriencesController } from './expriences.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exprience } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Exprience])],
  controllers: [ExpriencesController],
  providers: [ExpriencesService],
})
export class ExpriencesModule {}
