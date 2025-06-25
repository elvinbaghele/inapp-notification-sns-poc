import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateCommentDto } from '../dto/create-comment.dto';
export declare class CommentService {
    private readonly eventEmitter;
    constructor(eventEmitter: EventEmitter2);
    createComment(commentData: CreateCommentDto, authorId: string): Promise<any>;
    private extractMentions;
    private commentRepository;
}
