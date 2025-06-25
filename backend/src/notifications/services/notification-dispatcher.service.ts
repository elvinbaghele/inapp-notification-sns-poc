import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import {
  Notification,
  NotificationStatus,
} from '../entities/notification.entity';
import { NotificationRepository } from '../repositories/notification.repository';

@Injectable()
export class NotificationDispatcherService {
  private readonly logger = new Logger(NotificationDispatcherService.name);
  private readonly snsClient: SNSClient;
  constructor(private readonly notificationRepository: NotificationRepository) {
    this.snsClient = new SNSClient({
      region: process.env.AWS_REGION || 'us-west-1',
      credentials: {
        accessKeyId: 'AKIAQMTDSUTSTZ53Q4T7',
        secretAccessKey: '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',
      },
    });
  }

  async dispatch(notification: Notification): Promise<void> {
    try {
      for (const channel of notification.channels) {
        await this.sendToChannel(notification, channel);
      }
      await this.notificationRepository.updateStatus(
        notification.id,
        NotificationStatus.SENT,
      );
    } catch (error) {
      this.logger.error(
        `Failed to dispatch notification ${notification.id}:`,
        error.stack,
      );
      await this.notificationRepository.updateStatus(
        notification.id,
        NotificationStatus.FAILED,
      );
    }
  }
  private async sendToChannel(
    notification: Notification,
    channel: string,
  ): Promise<void> {
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
  private async sendInAppNotification(
    notification: Notification,
  ): Promise<void> {
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
      const command = new PublishCommand({
        // TopicArn: 'arn:aws:sns:us-west-1:027052385509:notification-test',
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
      this.logger.log(
        `In-app notification sent for user ${notification.receiverId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send in-app notification for user ${notification.receiverId}: ${error.message}`,
        error.stack,
      );
      // Optionally, rethrow or handle error as needed
    }
  }
  private async sendEmailNotification(
    notification: Notification,
  ): Promise<void> {
    const message = {
      type: 'email-notification',
      userId: notification.receiverId,
      subject: notification.title,
      body: notification.message,
      templateData: notification.metadata,
    };
    const command = new PublishCommand({
      TopicArn: '',
      Message: JSON.stringify(message),
    });
    await this.snsClient.send(command);
    this.logger.log(
      `Email notification queued for user ${notification.receiverId}`,
    );
  }
}
