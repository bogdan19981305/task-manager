import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class TaskCreateDto {
  @ApiProperty({
    description: 'The title of the task',
    example: 'Task title',
    required: true,
    minLength: 3,
    maxLength: 255,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'The content of the task',
    example: 'Task content',
    required: false,
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({
    description: 'The assignee id of the task',
    example: 1,
    required: false,
  })
  @IsInt()
  @IsOptional()
  assigneeId?: number;
}
