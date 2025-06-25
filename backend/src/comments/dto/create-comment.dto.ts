import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ArrayNotEmpty, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Comment text',
    example: 'Discount 5%',
    nullable: true,
  })
  @IsString()
  text: string;

  @ApiProperty({
    description: 'Task ID',
    example: 'some-task-id',
    nullable: true,
  })
  @IsString()
  taskId: string;

  @ApiProperty({
    description: 'Mentioned user IDs',
    example: ['user1', 'user2'],
    type: [String],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  mention_user_ids?: string[];
}
