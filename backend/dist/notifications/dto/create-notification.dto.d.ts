import { NotificationType, NotificationPriority } from '../entities/notification.entity';
export declare class CreateNotificationDto {
    title: string;
    message: string;
    type: NotificationType;
    priority?: NotificationPriority;
    senderId: string;
    receiverId: string;
    referenceType: string;
    referenceId: string;
    channels?: string[];
    metadata?: Record<string, any>;
}
