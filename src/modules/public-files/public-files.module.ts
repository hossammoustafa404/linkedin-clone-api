import { Module } from '@nestjs/common';
import { PublicFilesService } from './public-files.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicImage, PublicVideo } from './entities';
import { PublicFilesController } from './public-files.controller';
import { SupabaseModule } from '../../shared/supabase/supabse.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PublicImage, PublicVideo]),
    SupabaseModule,
  ],
  controllers: [PublicFilesController],
  providers: [PublicFilesService],
  exports: [PublicFilesService],
})
export class PublicFilesModule {}
