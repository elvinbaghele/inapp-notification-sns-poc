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
exports.CommentService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
let CommentService = class CommentService {
    eventEmitter;
    constructor(eventEmitter) {
        this.eventEmitter = eventEmitter;
    }
    async createComment(commentData, authorId) {
        const comment = await this.commentRepository.save({
            ...commentData,
            authorId,
        });
        const mentionedUserIds = commentData.mention_user_ids || [];
        for (const mentionedUserId of mentionedUserIds) {
            if (mentionedUserId !== authorId) {
                const event = {
                    commentId: comment.id,
                    taskId: commentData.taskId,
                    taskTitle: comment.task.title,
                    mentionedUserId,
                    mentionedByUserId: authorId,
                    commentText: commentData.text,
                };
                this.eventEmitter.emit('comment.mentioned', event);
            }
        }
        return comment;
    }
    extractMentions(text) {
        const regex = /@([a-zA-Z0-9_-]+)/g;
        const matches = [];
        let match;
        while ((match = regex.exec(text)) !== null) {
            matches.push(match[1]);
        }
        return matches;
    }
    commentRepository = {
        save: async (data) => ({
            ...data,
            id: 'comment-id',
            task: { title: 'Task Title' },
        }),
    };
};
exports.CommentService = CommentService;
exports.CommentService = CommentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [event_emitter_1.EventEmitter2])
], CommentService);
//# sourceMappingURL=comment.service.js.map