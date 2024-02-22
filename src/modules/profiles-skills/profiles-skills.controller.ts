import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProfilesSkillsService } from './profiles-skills.service';
import { JwtAuthGuard } from '../auth/guards';
import { CreateSkillDto } from './dtos';
import { RequestWithUser } from 'src/shared/interfaces';
import { UUID } from 'crypto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Profiles Skills')
@Controller()
export class ProfilesSkillsController {
  constructor(private readonly profilesSkillsService: ProfilesSkillsService) {}

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiConflictResponse({
    description: 'Maybe the profile has already the skill',
  })
  @ApiCreatedResponse({
    description: 'The profile skill has been successfully created',
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('profiles/me/skills')
  async createOneSkill(
    @Body() createSkillDto: CreateSkillDto,
    @Req() reqWithUser: RequestWithUser,
  ) {
    const profileSkill = await this.profilesSkillsService.createOneSkill(
      createSkillDto,
      reqWithUser.user.profile.id,
    );
    return { profileSkill };
  }

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiOkResponse({
    description: 'The profile skills have been successfully gotten',
  })
  @UseGuards(JwtAuthGuard)
  @Get('profiles/:profileId/skills')
  async findManySkills(@Param('profileId', ParseUUIDPipe) profileId: UUID) {
    const { profileSkills, count } =
      await this.profilesSkillsService.findManySkills(profileId);
    return { count, profileSkills };
  }

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'The profile skill does not exist' })
  @ApiOkResponse({
    description: 'The profile skill has been successfully gotten',
  })
  @UseGuards(JwtAuthGuard)
  @Get('profiles/:profileId/skills/:skillId')
  async findOneSkill(
    @Param('profileId', ParseUUIDPipe) profileId: UUID,
    @Param('skillId', ParseUUIDPipe) skillId: UUID,
  ) {
    const profileSkill = await this.profilesSkillsService.findOneSkill(
      profileId,
      skillId,
    );
    if (!profileSkill) {
      throw new NotFoundException('The profile skill does not exist');
    }
    return { profileSkill };
  }

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'The profile skill does not exist' })
  @ApiNoContentResponse({
    description: 'The profile skill has been successfully deleted',
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('profiles/me/skills/:skillId')
  async deleteOneSkill(
    @Req() reqWithUser: RequestWithUser,
    @Param('skillId', ParseUUIDPipe) skillId: UUID,
  ) {
    await this.profilesSkillsService.deleteOneSkill(
      reqWithUser.user.profile.id,
      skillId,
    );
  }
}
