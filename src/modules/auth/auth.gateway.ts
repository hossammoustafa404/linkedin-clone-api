import {
  ParseUUIDPipe,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  OnGatewayInit,
  ConnectedSocket,
} from '@nestjs/websockets';
import { UUID } from 'crypto';
import { Server, Socket } from 'socket.io';
import { JwtAuthGuard } from './guards';

@WebSocketGateway()
export class AuthGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  io: Server;

  afterInit(server: any) {
    console.log('Authentication gateway has been initialized');
  }

  handleConnection(client: Socket) {
    const { sockets } = this.io.sockets;
    console.log(`The client with id: ${client.id} connected to the server`);
    console.log(
      `The number of clients connected to the server is: ${sockets.size}`,
    );
  }

  handleDisconnect(client: any) {
    console.log(
      `The client with id: ${client.id} disconnected from the server`,
    );
  }

  //   @UseGuards(JwtAuthGuard)
  @SubscribeMessage('user authenticated')
  // Validate user id (to do)
  handleUserAuthenticated(
    @MessageBody('userId') userId: UUID,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(userId);
    console.log(
      `Client with id: ${client.id} has joined the room with id: ${userId}`,
    );
    return userId;
  }
}
