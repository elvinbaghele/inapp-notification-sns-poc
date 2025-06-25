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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = exports.NotificationPriority = exports.NotificationStatus = exports.NotificationType = void 0;
const typeorm_1 = require("typeorm");
var NotificationType;
(function (NotificationType) {
    NotificationType["TASK_ASSIGNED"] = "TASK_ASSIGNED";
    NotificationType["MENTIONED_IN_COMMENT"] = "MENTIONED_IN_COMMENT";
    NotificationType["TASK_STATUS_CHANGED"] = "TASK_STATUS_CHANGED";
    NotificationType["TASK_DUE_SOON"] = "TASK_DUE_SOON";
    NotificationType["PROJECT_UPDATED"] = "PROJECT_UPDATED";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var NotificationStatus;
(function (NotificationStatus) {
    NotificationStatus["PENDING"] = "PENDING";
    NotificationStatus["SENT"] = "SENT";
    NotificationStatus["DELIVERED"] = "DELIVERED";
    NotificationStatus["READ"] = "READ";
    NotificationStatus["FAILED"] = "FAILED";
})(NotificationStatus || (exports.NotificationStatus = NotificationStatus = {}));
var NotificationPriority;
(function (NotificationPriority) {
    NotificationPriority["LOW"] = "LOW";
    NotificationPriority["MEDIUM"] = "MEDIUM";
    NotificationPriority["HIGH"] = "HIGH";
    NotificationPriority["URGENT"] = "URGENT";
})(NotificationPriority || (exports.NotificationPriority = NotificationPriority = {}));
let Notification = class Notification {
    id;
    title;
    message;
    type;
    priority;
    senderId;
    receiverId;
    referenceType;
    referenceId;
    channels = ['in-app'];
    status;
    metadata;
    isDeleted;
    createdAt;
    updatedAt;
    sentAt;
    deliveredAt;
    readAt;
};
exports.Notification = Notification;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Notification.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Notification.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Notification.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: NotificationType }),
    __metadata("design:type", String)
], Notification.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: NotificationPriority,
        default: NotificationPriority.MEDIUM,
    }),
    __metadata("design:type", String)
], Notification.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sender_id' }),
    __metadata("design:type", String)
], Notification.prototype, "senderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'receiver_id' }),
    __metadata("design:type", String)
], Notification.prototype, "receiverId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reference_type' }),
    __metadata("design:type", String)
], Notification.prototype, "referenceType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reference_id' }),
    __metadata("design:type", String)
], Notification.prototype, "referenceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: false }),
    __metadata("design:type", Array)
], Notification.prototype, "channels", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: NotificationStatus,
        default: NotificationStatus.PENDING,
    }),
    __metadata("design:type", String)
], Notification.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Notification.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_deleted', default: false }),
    __metadata("design:type", Boolean)
], Notification.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Notification.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Notification.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sent_at', nullable: true }),
    __metadata("design:type", Date)
], Notification.prototype, "sentAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'delivered_at', nullable: true }),
    __metadata("design:type", Date)
], Notification.prototype, "deliveredAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'read_at', nullable: true }),
    __metadata("design:type", Date)
], Notification.prototype, "readAt", void 0);
exports.Notification = Notification = __decorate([
    (0, typeorm_1.Entity)('notifications'),
    (0, typeorm_1.Index)(['receiverId', 'status']),
    (0, typeorm_1.Index)(['receiverId', 'createdAt'])
], Notification);
//# sourceMappingURL=notification.entity.js.map