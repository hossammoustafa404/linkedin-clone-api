import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto, FindUsersQueryDto } from './dtos';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '../../shared/interfaces';
import { RolesGuard } from 'src/shared/guards';
import { Roles } from 'src/shared/decorators';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdateMeDto } from './dtos/update-me.dto';
import { UserRole } from './enums/user-role.enum';
import { UUID } from 'crypto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { responseWithPagination } from 'src/shared/utils';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiForbiddenResponse({
    description: 'Maybe the user role is not allowed to create a user',
  })
  @ApiConflictResponse({ description: 'Neither email or username is taken' })
  @ApiCreatedResponse({
    description: 'The user has been successfully created',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SuperAdmin, UserRole.SuperAdmin)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createOne(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.createOne(createUserDto);
    return { user };
  }

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiForbiddenResponse({
    description: 'Maybe the user role is not allowed to get the users',
  })
  @ApiOkResponse({
    description: 'The users have been successfully gotten',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SuperAdmin)
  @Get()
  async findMany(@Query() query: FindUsersQueryDto) {
    const { users, totalCount, page, limit } =
      await this.usersService.findMany(query);
    return responseWithPagination(
      { totalCount, pageCount: users.length, currentPage: page, limit },
      users,
    );
  }

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'The user does not exist' })
  @ApiForbiddenResponse({
    description: 'Maybe the user role is not allowed to get the user',
  })
  @ApiOkResponse({
    description: 'The user have been successfully gotten',
  })
  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  async findOneById(
    @Param('userId', ParseUUIDPipe) userId: UUID,
    @Req() reqWithUser: RequestWithUser,
  ) {
    console.log(reqWithUser?.user);

    const user = await this.usersService.findOneById(userId, reqWithUser.user);
    return { user };
  }

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'The user does not exist' })
  @ApiOkResponse({
    description: 'The user has been successfully updated',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateMe(
    @Req() req: RequestWithUser,
    @Body() updateMeDto: UpdateMeDto,
  ) {
    const updatedUser = await this.usersService.updateOneById(
      req.user.id,
      updateMeDto,
    );

    return {
      user: updatedUser,
    };
  }

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'The user does not exist' })
  @ApiOkResponse({
    description: 'The user has been successfully updated',
  })
  @ApiForbiddenResponse({
    description: 'Maybe the user role is not allowed to update the user',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SuperAdmin)
  @Patch(':userId')
  async updateOneById(
    @Param('userId', ParseUUIDPipe) userId: UUID,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.updateOneById(
      userId,
      undefined,
      updateUserDto,
    );

    return {
      user,
    };
  }

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'The user does not exist' })
  @ApiNoContentResponse({
    description: 'The user has been successfully deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async deleteMe(@Req() reqWithUser: RequestWithUser) {
    await this.usersService.deleteOneById(reqWithUser.user.id);
  }

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'The user does not exist' })
  @ApiForbiddenResponse({
    description: 'Maybe the user role is not allowed to delete the user',
  })
  @ApiNoContentResponse({
    description: 'The user has been successfully deleted',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SuperAdmin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':userId')
  async deleteOneById(
    @Param('userId', ParseUUIDPipe) userId: UUID,
    @Req() req: RequestWithUser,
  ) {
    await this.usersService.deleteOneById(userId);
  }
}
