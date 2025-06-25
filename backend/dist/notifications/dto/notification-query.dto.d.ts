import { NotificationStatus, NotificationType } from '../entities/notification.entity';
export declare class NotificationQueryDto {
    limit?: number;
    offset?: number;
    status?: NotificationStatus;
    type?: NotificationType;
    unreadOnly?: boolean;
}
