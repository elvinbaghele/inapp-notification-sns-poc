import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { NotificationService } from '../services/notification.service';

@WebSocketGateway(3002, { cors: true, namespace: '/notifications' })
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  private readonly logger = new Logger(NotificationGateway.name);
  private userSockets = new Map<string, Set<string>>(); // userId -> Set of socketIds

  constructor(private readonly notificationService: NotificationService) {}

  async handleConnection(client: Socket) {
    try {
      // Extract userId from auth token or query params
      const userId = client.handshake.query.userId as string;
      if (!userId) {
        client.disconnect();
        return;
      }
      // Store user socket mapping
      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }
      const sockets = this.userSockets.get(userId);
      if (sockets) {
        sockets.add(client.id);
      }
      client.join(`user:${userId}`);
      this.logger.log(`User ${userId} connected with socket ${client.id}`);
      // Send unread count on connection
      const unreadCount = await this.notificationService.getUnreadCount(userId);
      client.emit('unread-count', { count: unreadCount });
    } catch (error) {
      this.logger.error('Connection error:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    // Remove from user socket mapping
    for (const [userId, sockets] of this.userSockets.entries()) {
      if (sockets.has(client.id)) {
        sockets.delete(client.id);
        if (sockets.size === 0) {
          this.userSockets.delete(userId);
        }
        this.logger.log(`User ${userId} disconnected socket ${client.id}`);
        break;
      }
    }
  }

  @SubscribeMessage('mark-as-read')
  async handleMarkAsRead(client: Socket, data: { notificationId: string }) {
    const userId = client.handshake.query.userId as string;
    const success = await this.notificationService.markAsRead(
      data.notificationId,
      userId,
    );
    if (success) {
      const unreadCount = await this.notificationService.getUnreadCount(userId);
      this.server
        .to(`user:${userId}`)
        .emit('unread-count', { count: unreadCount });
    }
    return { success };
  }

  // Method to send real-time notifications
  async sendToUser(userId: string, notification: any) {
    this.server.to(`user:${userId}`).emit('new-notification', notification);
    // Update unread count
    const unreadCount = await this.notificationService.getUnreadCount(userId);
    this.server
      .to(`user:${userId}`)
      .emit('unread-count', { count: unreadCount });
  }
}
