import {
  IsString,
  IsEnum,
  IsUUID,
  IsOptional,
  IsArray,
  IsObject,
} from 'class-validator';
import {
  NotificationType,
  NotificationPriority,
} from '../entities/notification.entity';

export class CreateNotificationDto {
  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsOptional()
  @IsEnum(NotificationPriority)
  priority?: NotificationPriority;

  @IsUUID()
  senderId: string;

  @IsUUID()
  receiverId: string;

  @IsString()
  referenceType: string;

  @IsUUID()
  referenceId: string;

  @IsOptional()
  @IsArray()
  channels?: string[];

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
