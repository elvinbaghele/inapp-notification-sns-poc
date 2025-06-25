"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsModule = void 0;
const common_1 = require("@nestjs/common");
const notification_service_1 = require("./services/notification.service");
const notification_dispatcher_service_1 = require("./services/notification-dispatcher.service");
const notification_repository_1 = require("./repositories/notification.repository");
const notification_entity_1 = require("./entities/notification.entity");
const typeorm_1 = require("@nestjs/typeorm");
let NotificationsModule = class NotificationsModule {
};
exports.NotificationsModule = NotificationsModule;
exports.NotificationsModule = NotificationsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([notification_entity_1.Notification])],
        providers: [
            notification_service_1.NotificationService,
            notification_dispatcher_service_1.NotificationDispatcherService,
            notification_repository_1.NotificationRepository,
        ],
        exports: [
            notification_service_1.NotificationService,
            notification_dispatcher_service_1.NotificationDispatcherService,
            notification_repository_1.NotificationRepository,
        ],
    })
], NotificationsModule);
//# sourceMappingURL=notifications.module.js.map