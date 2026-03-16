import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from 'src/generated/prisma/client';

export class TaskUpdateDto {
  @ApiProperty({
    description: 'The title of the task',
    example: 'Task title',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'The assignee id of the task',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  assigneeId?: number;

  @ApiProperty({
    description: 'The status of the task',
    example: 'TODO',
    required: false,
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty({
    description: 'The content of the task',
    example: 'Task content',
    required: false,
  })
  @IsString()
  @IsOptional()
  content?: string;
}
