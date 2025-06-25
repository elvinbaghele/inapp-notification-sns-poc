import { Notification } from '../entities/notification.entity';
import { NotificationRepository } from '../repositories/notification.repository';
export declare class NotificationDispatcherService {
    private readonly notificationRepository;
    private readonly logger;
    private readonly snsClient;
    constructor(notificationRepository: NotificationRepository);
    dispatch(notification: Notification): Promise<void>;
    private sendToChannel;
    private sendInAppNotification;
    private sendEmailNotification;
}
