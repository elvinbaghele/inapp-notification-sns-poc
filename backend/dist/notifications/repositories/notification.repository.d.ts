import { Repository } from 'typeorm';
import { Notification, NotificationStatus } from '../entities/notification.entity';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { NotificationQueryDto } from '../dto/notification-query.dto';
export declare class NotificationRepository {
    private readonly notificationRepository;
    constructor(notificationRepository: Repository<Notification>);
    create(createNotificationDto: CreateNotificationDto): Promise<Notification>;
    findByUserId(userId: string, query: NotificationQueryDto): Promise<{
        notifications: Notification[];
        total: number;
    }>;
    markAsRead(notificationId: string, userId: string): Promise<boolean>;
    markAllAsRead(userId: string): Promise<number>;
    getUnreadCount(userId: string): Promise<number>;
    updateStatus(id: string, status: NotificationStatus): Promise<void>;
}
