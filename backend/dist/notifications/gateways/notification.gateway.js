"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var NotificationGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const notification_service_1 = require("../services/notification.service");
let NotificationGateway = NotificationGateway_1 = class NotificationGateway {
    notificationService;
    server;
    logger = new common_1.Logger(NotificationGateway_1.name);
    userSockets = new Map();
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    async handleConnection(client) {
        try {
            const userId = client.handshake.query.userId;
            if (!userId) {
                client.disconnect();
                return;
            }
            if (!this.userSockets.has(userId)) {
                this.userSockets.set(userId, new Set());
            }
            const sockets = this.userSockets.get(userId);
            if (sockets) {
                sockets.add(client.id);
            }
            client.join(`user:${userId}`);
            this.logger.log(`User ${userId} connected with socket ${client.id}`);
            const unreadCount = await this.notificationService.getUnreadCount(userId);
            client.emit('unread-count', { count: unreadCount });
        }
        catch (error) {
            this.logger.error('Connection error:', error);
            client.disconnect();
        }
    }
    handleDisconnect(client) {
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
    async handleMarkAsRead(client, data) {
        const userId = client.handshake.query.userId;
        const success = await this.notificationService.markAsRead(data.notificationId, userId);
        if (success) {
            const unreadCount = await this.notificationService.getUnreadCount(userId);
            this.server
                .to(`user:${userId}`)
                .emit('unread-count', { count: unreadCount });
        }
        return { success };
    }
    async sendToUser(userId, notification) {
        this.server.to(`user:${userId}`).emit('new-notification', notification);
        const unreadCount = await this.notificationService.getUnreadCount(userId);
        this.server
            .to(`user:${userId}`)
            .emit('unread-count', { count: unreadCount });
    }
};
exports.NotificationGateway = NotificationGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], NotificationGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('mark-as-read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], NotificationGateway.prototype, "handleMarkAsRead", null);
exports.NotificationGateway = NotificationGateway = NotificationGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)(3002, { cors: true, namespace: '/notifications' }),
    __metadata("design:paramtypes", [notification_service_1.NotificationService])
], NotificationGateway);
//# sourceMappingURL=notification.gateway.js.map