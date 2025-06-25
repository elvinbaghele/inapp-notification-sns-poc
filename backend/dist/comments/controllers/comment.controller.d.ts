import { CreateCommentDto } from '../dto/create-comment.dto';
import { CommentService } from '../services/comment.service';
export declare class CommentController {
    private readonly commentService;
    constructor(commentService: CommentService);
    createComment(createCommentDto: CreateCommentDto, req: any): Promise<any>;
}
