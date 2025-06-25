"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notification_entity_1 = require("../entities/notification.entity");
let NotificationRepository = class NotificationRepository {
    notificationRepository;
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    async create(createNotificationDto) {
        const notification = this.notificationRepository.create(createNotificationDto);
        return this.notificationRepository.save(notification);
    }
    async findByUserId(userId, query) {
        const where = {
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
            where.status = notification_entity_1.NotificationStatus.PENDING;
        }
        const [notifications, total] = await this.notificationRepository.findAndCount({
            where,
            order: { createdAt: 'DESC' },
            take: query.limit,
            skip: query.offset,
        });
        return { notifications, total };
    }
    async markAsRead(notificationId, userId) {
        const result = await this.notificationRepository.update({ id: notificationId, receiverId: userId }, { status: notification_entity_1.NotificationStatus.READ, readAt: new Date() });
        return (result.affected ?? 0) > 0;
    }
    async markAllAsRead(userId) {
        const result = await this.notificationRepository.update({ receiverId: userId, status: notification_entity_1.NotificationStatus.PENDING }, { status: notification_entity_1.NotificationStatus.READ, readAt: new Date() });
        return result.affected || 0;
    }
    async getUnreadCount(userId) {
        return this.notificationRepository.count({
            where: {
                receiverId: userId,
                status: notification_entity_1.NotificationStatus.PENDING,
                isDeleted: false,
            },
        });
    }
    async updateStatus(id, status) {
        const updateData = { status };
        if (status === notification_entity_1.NotificationStatus.SENT) {
            updateData.sentAt = new Date();
        }
        else if (status === notification_entity_1.NotificationStatus.DELIVERED) {
            updateData.deliveredAt = new Date();
        }
        await this.notificationRepository.update(id, updateData);
    }
};
exports.NotificationRepository = NotificationRepository;
exports.NotificationRepository = NotificationRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], NotificationRepository);
//# sourceMappingURL=notification.repository.js.map