import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { CommentService } from '../services/comment.service';

@ApiTags('comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({ status: 201, description: 'Comment created successfully.' })
  async createComment(
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: any, // Replace with actual user extraction logic
  ) {
    // For now, use a dummy userId. Replace with real auth logic.
    const authorId = req.user?.id || 'dummy-user-id';
    const comment = await this.commentService.createComment(
      createCommentDto,
      authorId,
    );
    return comment;
  }
}
