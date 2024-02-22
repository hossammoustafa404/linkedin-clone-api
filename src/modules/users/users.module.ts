import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteUser } from './entities/site-user.entity';
import { ProfilesModule } from '../profiles/profiles.module';
import { PublicFilesModule } from '../public-files/public-files.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SiteUser]),
    ProfilesModule,
    PublicFilesModule,
  ],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
