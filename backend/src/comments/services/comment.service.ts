import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MentionedInCommentEvent } from '../../notifications/services/notification.service';
import { CreateCommentDto } from '../dto/create-comment.dto';

// ===== USAGE EXAMPLES =====
// Example 2: Comment Mention in Comment Service
// src/comments/services/comment.service.ts
@Injectable()
export class CommentService {
  constructor(private readonly eventEmitter: EventEmitter2) {}
  async createComment(commentData: CreateCommentDto, authorId: string) {
    // Save comment metadata (message)
    const comment = await this.commentRepository.save({
      ...commentData,
      authorId,
    });
    // Use mention_user_ids from DTO
    const mentionedUserIds = commentData.mention_user_ids || [];
    // Emit mention events for each mentioned user
    for (const mentionedUserId of mentionedUserIds) {
      if (mentionedUserId !== authorId) {
        const event: MentionedInCommentEvent = {
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
  // Dummy implementation for extractMentions
  private extractMentions(text: string): string[] {
    // Example: extract @userId from text
    const regex = /@([a-zA-Z0-9_-]+)/g;
    const matches: string[] = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      matches.push(match[1]);
    }
    return matches;
  }
  // Dummy property for commentRepository
  private commentRepository = {
    save: async (data: any) => ({
      ...data,
      id: 'comment-id',
      task: { title: 'Task Title' },
    }),
  };
}
