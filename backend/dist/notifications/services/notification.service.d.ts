import { NotificationRepository } from '../repositories/notification.repository';
import { NotificationDispatcherService } from './notification-dispatcher.service';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { NotificationQueryDto } from '../dto/notification-query.dto';
import { Notification } from '../entities/notification.entity';
export interface TaskAssignedEvent {
    taskId: string;
    taskTitle: string;
    assignedToUserId: string;
    assignedByUserId: string;
    projectName: string;
}
export interface MentionedInCommentEvent {
    commentId: string;
    taskId: string;
    taskTitle: string;
    mentionedUserId: string;
    mentionedByUserId: string;
    commentText: string;
}
export declare class NotificationService {
    private readonly notificationRepository;
    private readonly notificationDispatcher;
    private readonly logger;
    constructor(notificationRepository: NotificationRepository, notificationDispatcher: NotificationDispatcherService);
    handleTaskAssigned(event: TaskAssignedEvent): Promise<void>;
    handleMentionedInComment(event: MentionedInCommentEvent): Promise<void>;
    createNotification(createNotificationDto: CreateNotificationDto): Promise<Notification>;
    private createAndDispatch;
    getUserNotifications(userId: string, query: NotificationQueryDto): Promise<{
        notifications: Notification[];
        total: number;
    }>;
    markAsRead(notificationId: string, userId: string): Promise<boolean>;
    markAllAsRead(userId: string): Promise<number>;
    getUnreadCount(userId: string): Promise<number>;
}
