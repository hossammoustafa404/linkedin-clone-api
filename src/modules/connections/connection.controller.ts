import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { JwtAuthGuard } from '../auth/guards';
import {
  CreateConnectionDto,
  FindConnectionsQueryDto,
  FindMyConnectionsQueryDto,
  FindOneQueryDto,
  UpdateConnectionDto,
} from './dtos';
import { RequestWithUser } from '../../shared/interfaces';
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
import { responseWithPagination } from '../../shared/utils';

@ApiTags('Connections')
@Controller('connections')
export class ConnectionsController {
  constructor(private readonly connectionsService: ConnectionsService) {}

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiForbiddenResponse({
    description: 'Maybe the user want to send a connection to himself',
  })
  @ApiNotFoundResponse({ description: 'Maybe the reciever does not exist' })
  @ApiConflictResponse({
    description:
      'Maybe the user has been sent a connection to the reciever one',
  })
  @ApiCreatedResponse({
    description: 'The connection has been successfully sent',
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createOne(
    @Body() createConnectionDto: CreateConnectionDto,
    @Req() reqWithUser: RequestWithUser,
  ) {
    const connection = await this.connectionsService.createOne(
      reqWithUser?.user?.id,
      createConnectionDto,
    );
    return { connection };
  }

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiOkResponse({
    description: 'The current user connections have been successfully gotten',
  })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async findMyConnections(
    @Query() query: FindMyConnectionsQueryDto,
    @Req() reqWithUser: RequestWithUser,
  ) {
    const { connections, totalCount, page, limit } =
      await this.connectionsService.findMyConnections(
        reqWithUser?.user?.id,
        query,
      );
    return responseWithPagination(
      { totalCount, pageCount: connections.length, currentPage: page, limit },
      connections,
    );
  }

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiOkResponse({
    description: 'A user connections have been successfully gotten',
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  async findMany(@Query() query: FindConnectionsQueryDto) {
    const { connections, totalCount, page, limit } =
      await this.connectionsService.findMany(query);
    return responseWithPagination(
      { totalCount, pageCount: connections.length, currentPage: page, limit },
      connections,
    );
  }

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiBadRequestResponse({
    description: 'Maybe the sender id equals the reciever id',
  })
  @ApiNotFoundResponse({ description: 'The connection does not exist' })
  @ApiOkResponse({
    description: 'The connection has been successfully gotten',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/one')
  async findOnebySenderAndRecieverIds(@Query() query: FindOneQueryDto) {
    const { senderId, recieverId } = query;

    // Should be removed to the validation layer !!
    if (senderId === recieverId) {
      throw new BadRequestException('Sender id cannot equal reciever id');
    }

    const connection = await this.connectionsService.findOneConnection(
      senderId,
      recieverId,
    );

    if (!connection) {
      throw new NotFoundException('There is no connection between both users');
    }

    return connection;
  }

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'The connection does not exist' })
  @ApiForbiddenResponse({
    description: 'Maybe the user want to update a status to pending',
  })
  @ApiOkResponse({
    description: 'The connection has been successfully updated',
  })
  @UseGuards(JwtAuthGuard)
  @Patch(':connectionId')
  async updateOneById(
    @Param('connectionId', ParseUUIDPipe) connectionId: UUID,
    @Body() updateConnectionDto: UpdateConnectionDto,
    @Req() reqWithUser: RequestWithUser,
  ) {
    const connection = await this.connectionsService.updateOneById(
      connectionId,
      updateConnectionDto,
      reqWithUser?.user?.id,
    );
    return { connection };
  }

  @ApiUnauthorizedResponse({ description: 'The user is unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'The connection does not exist' })
  @ApiForbiddenResponse({
    description: 'Maybe the connection status is not accepted',
  })
  @ApiNoContentResponse({
    description: 'The connection has been successfully deleted',
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':connectionId')
  async deleteOneById(
    @Param('connectionId', ParseUUIDPipe) connectionId: UUID,
    @Req() reqWithUser: RequestWithUser,
  ) {
    await this.connectionsService.deleteOneById(
      connectionId,
      reqWithUser?.user?.id,
    );
  }
}
