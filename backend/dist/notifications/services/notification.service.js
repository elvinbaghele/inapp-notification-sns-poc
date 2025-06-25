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
var NotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const notification_repository_1 = require("../repositories/notification.repository");
const notification_dispatcher_service_1 = require("./notification-dispatcher.service");
const notification_entity_1 = require("../entities/notification.entity");
let NotificationService = NotificationService_1 = class NotificationService {
    notificationRepository;
    notificationDispatcher;
    logger = new common_1.Logger(NotificationService_1.name);
    constructor(notificationRepository, notificationDispatcher) {
        this.notificationRepository = notificationRepository;
        this.notificationDispatcher = notificationDispatcher;
    }
    async handleTaskAssigned(event) {
        const notificationDto = {
            title: 'Task Assigned',
            message: `You have been assigned to task: ${event.taskTitle}`,
            type: notification_entity_1.NotificationType.TASK_ASSIGNED,
            senderId: event.assignedByUserId,
            receiverId: event.assignedToUserId,
            referenceType: 'TASK',
            referenceId: event.taskId,
            metadata: {
                taskTitle: event.taskTitle,
                projectName: event.projectName,
            },
        };
        await this.createAndDispatch(notificationDto);
    }
    async handleMentionedInComment(event) {
        const notificationDto = {
            title: 'Mentioned in Comment',
            message: `You were mentioned in a comment on task: ${event.taskTitle}`,
            type: notification_entity_1.NotificationType.MENTIONED_IN_COMMENT,
            senderId: event.mentionedByUserId,
            receiverId: event.mentionedUserId,
            referenceType: 'COMMENT',
            referenceId: event.commentId,
            metadata: {
                taskId: event.taskId,
                taskTitle: event.taskTitle,
                commentText: event.commentText.substring(0, 100),
            },
        };
        await this.createAndDispatch(notificationDto);
    }
    async createNotification(createNotificationDto) {
        const notification = await this.notificationRepository.create(createNotificationDto);
        this.logger.log(`Notification created: ${notification.id}`);
        return notification;
    }
    async createAndDispatch(createNotificationDto) {
        try {
            const notification = await this.createNotification(createNotificationDto);
            await this.notificationDispatcher.dispatch(notification);
        }
        catch (error) {
            this.logger.error('Failed to create and dispatch notification:', error.stack);
        }
    }
    async getUserNotifications(userId, query) {
        return this.notificationRepository.findByUserId(userId, query);
    }
    async markAsRead(notificationId, userId) {
        return this.notificationRepository.markAsRead(notificationId, userId);
    }
    async markAllAsRead(userId) {
        return this.notificationRepository.markAllAsRead(userId);
    }
    async getUnreadCount(userId) {
        return this.notificationRepository.getUnreadCount(userId);
    }
};
exports.NotificationService = NotificationService;
__decorate([
    (0, event_emitter_1.OnEvent)('task.assigned'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationService.prototype, "handleTaskAssigned", null);
__decorate([
    (0, event_emitter_1.OnEvent)('comment.mentioned'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationService.prototype, "handleMentionedInComment", null);
exports.NotificationService = NotificationService = NotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [notification_repository_1.NotificationRepository,
        notification_dispatcher_service_1.NotificationDispatcherService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map