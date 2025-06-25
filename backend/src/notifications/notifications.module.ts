import { Module } from '@nestjs/common';
import { NotificationService } from './services/notification.service';
import { NotificationDispatcherService } from './services/notification-dispatcher.service';
import { NotificationRepository } from './repositories/notification.repository';
import { Notification } from './entities/notification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  providers: [
    NotificationService,
    NotificationDispatcherService,
    NotificationRepository,
  ],
  exports: [
    NotificationService,
    NotificationDispatcherService,
    NotificationRepository,
  ],
})
export class NotificationsModule {}
