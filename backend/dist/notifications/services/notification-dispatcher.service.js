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
var NotificationDispatcherService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationDispatcherService = void 0;
const common_1 = require("@nestjs/common");
const client_sns_1 = require("@aws-sdk/client-sns");
const notification_entity_1 = require("../entities/notification.entity");
const notification_repository_1 = require("../repositories/notification.repository");
let NotificationDispatcherService = NotificationDispatcherService_1 = class NotificationDispatcherService {
    notificationRepository;
    logger = new common_1.Logger(NotificationDispatcherService_1.name);
    snsClient;
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository;
        this.snsClient = new client_sns_1.SNSClient({
            region: process.env.AWS_REGION || 'us-west-1',
            credentials: {
                accessKeyId: 'AKIAQMTDSUTSTZ53Q4T7',
                secretAccessKey: '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',
            },
        });
    }
    async dispatch(notification) {
        try {
            for (const channel of notification.channels) {
                await this.sendToChannel(notification, channel);
            }
            await this.notificationRepository.updateStatus(notification.id, notification_entity_1.NotificationStatus.SENT);
        }
        catch (error) {
            this.logger.error(`Failed to dispatch notification ${notification.id}:`, error.stack);
            await this.notificationRepository.updateStatus(notification.id, notification_entity_1.NotificationStatus.FAILED);
        }
    }
    async sendToChannel(notification, channel) {
        switch (channel) {
            case 'in-app':
                await this.sendInAppNotification(notification);
                break;
            case 'email':
                await this.sendEmailNotification(notification);
                break;
            default:
                this.logger.warn(`Unknown notification channel: ${channel}`);
        }
    }
    async sendInAppNotification(notification) {
        try {
            const message = {
                type: 'in-app-notification',
                userId: notification.receiverId,
                data: {
                    id: notification.id,
                    title: notification.title,
                    message: notification.message,
                    type: notification.type,
                    priority: notification.priority,
                    createdAt: notification.createdAt,
                    metadata: notification.metadata,
                },
            };
            const command = new client_sns_1.PublishCommand({
                TopicArn: 'arn:aws:sns:us-west-1:027052385509:sns',
                Message: JSON.stringify(message),
                MessageAttributes: {
                    userId: {
                        DataType: 'String',
                        StringValue: notification.receiverId,
                    },
                },
            });
            await this.snsClient.send(command);
            this.logger.log(`In-app notification sent for user ${notification.receiverId}`);
        }
        catch (error) {
            this.logger.error(`Failed to send in-app notification for user ${notification.receiverId}: ${error.message}`, error.stack);
        }
    }
    async sendEmailNotification(notification) {
        const message = {
            type: 'email-notification',
            userId: notification.receiverId,
            subject: notification.title,
            body: notification.message,
            templateData: notification.metadata,
        };
        const command = new client_sns_1.PublishCommand({
            TopicArn: '',
            Message: JSON.stringify(message),
        });
        await this.snsClient.send(command);
        this.logger.log(`Email notification queued for user ${notification.receiverId}`);
    }
};
exports.NotificationDispatcherService = NotificationDispatcherService;
exports.NotificationDispatcherService = NotificationDispatcherService = NotificationDispatcherService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [notification_repository_1.NotificationRepository])
], NotificationDispatcherService);
//# sourceMappingURL=notification-dispatcher.service.js.map