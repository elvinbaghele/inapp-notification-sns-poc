import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { NotificationRepository } from '../repositories/notification.repository';
import { NotificationDispatcherService } from './notification-dispatcher.service';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { NotificationQueryDto } from '../dto/notification-query.dto';
import {
  Notification,
  NotificationType,
} from '../entities/notification.entity';

// Event interfaces
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

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly notificationDispatcher: NotificationDispatcherService,
  ) {}
  // ===== Event Handlers =====
  @OnEvent('task.assigned')
  async handleTaskAssigned(event: TaskAssignedEvent): Promise<void> {
    const notificationDto: CreateNotificationDto = {
      title: 'Task Assigned',
      message: `You have been assigned to task: ${event.taskTitle}`,
      type: NotificationType.TASK_ASSIGNED,
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
  @OnEvent('comment.mentioned')
  async handleMentionedInComment(
    event: MentionedInCommentEvent,
  ): Promise<void> {
    const notificationDto: CreateNotificationDto = {
      title: 'Mentioned in Comment',
      message: `You were mentioned in a comment on task: ${event.taskTitle}`,
      type: NotificationType.MENTIONED_IN_COMMENT,
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
  // ===== Core Methods =====
  async createNotification(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    const notification = await this.notificationRepository.create(
      createNotificationDto,
    );
    this.logger.log(`Notification created: ${notification.id}`);
    return notification;
  }
  private async createAndDispatch(
    createNotificationDto: CreateNotificationDto,
  ): Promise<void> {
    try {
      const notification = await this.createNotification(createNotificationDto);
      await this.notificationDispatcher.dispatch(notification);
    } catch (error) {
      this.logger.error(
        'Failed to create and dispatch notification:',
        error.stack,
      );
    }
  }
  async getUserNotifications(userId: string, query: NotificationQueryDto) {
    return this.notificationRepository.findByUserId(userId, query);
  }
  async markAsRead(notificationId: string, userId: string): Promise<boolean> {
    return this.notificationRepository.markAsRead(notificationId, userId);
  }
  async markAllAsRead(userId: string): Promise<number> {
    return this.notificationRepository.markAllAsRead(userId);
  }
  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationRepository.getUnreadCount(userId);
  }
}

// ===== USAGE EXAMPLES =====
// Example 1: Task Assignment in Task Service
// src/tasks/services/task.service.ts
// import { Injectable } from '@nestjs/common';
// import { EventEmitter2 } from '@nestjs/event-emitter';
// import { TaskAssignedEvent } from '../notifications/services/notification.service';
// @Injectable()
// export class TaskService {
//   constructor(private readonly eventEmitter: EventEmitter2) {}
//   async assignTask(taskId: string, assignedToUserId: string, assignedByUserId: string) {
//     // Your existing task assignment logic...
//     const task = await this.taskRepository.update(taskId, { assignedTo: assignedToUserId });
//     // Emit event for notification
//     const event: TaskAssignedEvent = {
//       taskId,
//       taskTitle: task.title,
//       assignedToUserId,
//       assignedByUserId,
//       projectName: task.project.name,
//     };
//     this.eventEmitter.emit('task.assigned', event);
//     return task;
//   }
// }
// Example 2: Comment Mention in Comment Service
// src/comments/services/comment.service.ts
// import { Injectable } from '@nestjs/common';
// import { EventEmitter2 } from '@nestjs/event-emitter';
// import { MentionedInCommentEvent } from '../notifications/services/notification.service';
// @Injectable()
// export class CommentService {
//   constructor(private readonly eventEmitter: EventEmitter2) {}
//   async createComment(commentData: CreateCommentDto, authorId: string) {
//     // Save comment
//     const comment = await this.commentRepository.save({
//       ...commentData,
//       authorId,
//     });
//     // Extract mentions from comment text
//     const mentionedUserIds = this.extractMentions(commentData.text);
//     // Emit mention events
//     for (const mentionedUserId of mentionedUserIds) {
//       if (mentionedUserId !== authorId) { // Don't notify self
//         const event: MentionedInCommentEvent = {
//           commentId: comment.id,
//           taskId: commentData.taskId,
//           taskTitle: comment.task.title,
//           mentionedUserId,
//           mentionedByUserId: authorId,
//           commentText: commentData.text,
//         };
//         this.eventEmitter.emit('comment.mentioned', event);
//       }
//     }
//     return comment;
//   }
// }
