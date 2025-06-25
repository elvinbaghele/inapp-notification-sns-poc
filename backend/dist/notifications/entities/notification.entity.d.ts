export declare enum NotificationType {
    TASK_ASSIGNED = "TASK_ASSIGNED",
    MENTIONED_IN_COMMENT = "MENTIONED_IN_COMMENT",
    TASK_STATUS_CHANGED = "TASK_STATUS_CHANGED",
    TASK_DUE_SOON = "TASK_DUE_SOON",
    PROJECT_UPDATED = "PROJECT_UPDATED"
}
export declare enum NotificationStatus {
    PENDING = "PENDING",
    SENT = "SENT",
    DELIVERED = "DELIVERED",
    READ = "READ",
    FAILED = "FAILED"
}
export declare enum NotificationPriority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    URGENT = "URGENT"
}
export declare class Notification {
    id: string;
    title: string;
    message: string;
    type: NotificationType;
    priority: NotificationPriority;
    senderId: string;
    receiverId: string;
    referenceType: string;
    referenceId: string;
    channels: string[];
    status: NotificationStatus;
    metadata: Record<string, any>;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    sentAt: Date;
    deliveredAt: Date;
    readAt: Date;
}
