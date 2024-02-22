import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { RequestWithUser } from '../../shared/interfaces';
import { JwtAuthGuard } from '../auth/guards';
import { UUID } from 'crypto';
import { FindProfilesQueryDto, UpdateProfileDto } from './dtos';
import { responseWithPagination } from '../../shared/utils';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiOkResponse({ description: 'The profiles have been successfully gotten' })
  @UseGuards(JwtAuthGuard)
  @Get()
  async findMany(@Query() query: FindProfilesQueryDto) {
    const { count, profiles, page, limit } =
      await this.profilesService.findMany(query);
    return responseWithPagination(
      {
        totalCount: count,
        pageCount: profiles.length,
        limit,
        currentPage: page,
      },
      profiles,
    );
  }

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'The profile does not exist' })
  @ApiOkResponse({ description: 'The profile has been successfully gotten' })
  @UseGuards(JwtAuthGuard)
  @Get(':profileId')
  async findOne(@Param('profileId', ParseUUIDPipe) profileId: UUID) {
    const profile = await this.profilesService.findOneById(profileId);
    return { profile };
  }

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'The profile does not exist' })
  @ApiOkResponse({ description: 'The profile has been successfully updated' })
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateOne(
    @Req() reqWithUser: RequestWithUser,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const profile = await this.profilesService.updateOneById(
      updateProfileDto,
      reqWithUser.user.id,
    );

    return { profile };
  }
}
