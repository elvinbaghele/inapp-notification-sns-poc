import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationService } from '../services/notification.service';
export declare class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly notificationService;
    server: Server;
    private readonly logger;
    private userSockets;
    constructor(notificationService: NotificationService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleMarkAsRead(client: Socket, data: {
        notificationId: string;
    }): Promise<{
        success: boolean;
    }>;
    sendToUser(userId: string, notification: any): Promise<void>;
}
