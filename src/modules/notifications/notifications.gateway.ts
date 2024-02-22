import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Notification } from './entities';

@WebSocketGateway()
export class NotificationsGateway {
  @WebSocketServer()
  io: Server;

  // @UseGuards(JwtAuthGuard) [TODO]
  @SubscribeMessage('notification sent')
  // Validate user id [TODO]
  handleNotificationSent(
    @MessageBody()
    notification: Notification,
  ) {
    const { recievers } = notification;
    const recieversIds = recievers.map(
      (recievernotification) => recievernotification.reciever.id,
    );

    this.io.to(recieversIds).emit('notification recieved', notification);
  }
}
