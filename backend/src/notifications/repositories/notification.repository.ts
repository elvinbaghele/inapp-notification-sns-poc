import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import {
  Notification,
  NotificationStatus,
} from '../entities/notification.entity';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { NotificationQueryDto } from '../dto/notification-query.dto';

@Injectable()
export class NotificationRepository {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    const notification = this.notificationRepository.create(
      createNotificationDto,
    );
    return this.notificationRepository.save(notification);
  }

  async findByUserId(
    userId: string,
    query: NotificationQueryDto,
  ): Promise<{ notifications: Notification[]; total: number }> {
    const where: FindOptionsWhere<Notification> = {
      receiverId: userId,
      isDeleted: false,
    };
    if (query.status) {
      where.status = query.status;
    }
    if (query.type) {
      where.type = query.type;
    }
    if (query.unreadOnly) {
      where.status = NotificationStatus.PENDING;
    }
    const [notifications, total] =
      await this.notificationRepository.findAndCount({
        where,
        order: { createdAt: 'DESC' },
        take: query.limit,
        skip: query.offset,
      });
    return { notifications, total };
  }

  async markAsRead(notificationId: string, userId: string): Promise<boolean> {
    const result = await this.notificationRepository.update(
      { id: notificationId, receiverId: userId },
      { status: NotificationStatus.READ, readAt: new Date() },
    );
    return (result.affected ?? 0) > 0;
  }

  async markAllAsRead(userId: string): Promise<number> {
    const result = await this.notificationRepository.update(
      { receiverId: userId, status: NotificationStatus.PENDING },
      { status: NotificationStatus.READ, readAt: new Date() },
    );
    return result.affected || 0;
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationRepository.count({
      where: {
        receiverId: userId,
        status: NotificationStatus.PENDING,
        isDeleted: false,
      },
    });
  }

  async updateStatus(id: string, status: NotificationStatus): Promise<void> {
    const updateData: Partial<Notification> = { status };
    if (status === NotificationStatus.SENT) {
      updateData.sentAt = new Date();
    } else if (status === NotificationStatus.DELIVERED) {
      updateData.deliveredAt = new Date();
    }
    await this.notificationRepository.update(id, updateData);
  }
}
