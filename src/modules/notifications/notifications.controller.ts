import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards';
import { CreateNotificationDto } from './dtos';
import { RequestWithUser } from '../../shared/interfaces';
import { UUID } from 'crypto';
import { FindNotificationsQueryDto } from './dtos/find-notifications-query.dto';
import { responseWithPagination } from '../../shared/utils';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiCreatedResponse({
    description: 'The notification has been successfully created',
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createOne(
    @Body() createNotificationDto: CreateNotificationDto,
    @Req() reqWithUser: RequestWithUser,
  ) {
    const notification = await this.notificationsService.createOne(
      createNotificationDto,
      reqWithUser.user.id,
    );
    return { notification };
  }

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiOkResponse({
    description: 'The notifications have been successfully gotten',
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  async findMany(
    @Query() query: FindNotificationsQueryDto,
    @Req() reqWithUser: RequestWithUser,
  ) {
    const { notifications, totalCount, page, limit } =
      await this.notificationsService.findMany(query, reqWithUser.user.id);
    return responseWithPagination(
      { totalCount, pageCount: notifications.length, limit, currentPage: page },
      notifications,
    );
  }

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'The notification does not exist' })
  @ApiNoContentResponse({
    description: 'The notification has been successfully deleted',
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':notificationId')
  async deleteOneByCompositeId(
    @Param('notificationId', ParseUUIDPipe) notificationId: UUID,
    @Req() reqWithUser: RequestWithUser,
  ) {
    await this.notificationsService.deleteOneByCompositeId(
      notificationId,
      reqWithUser.user.id,
    );
  }
}
