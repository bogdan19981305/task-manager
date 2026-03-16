import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { TaskStatus } from 'src/generated/prisma/client';
export class TaskQueryDto {
  @ApiProperty({
    description: 'The status of the task',
    example: 'TODO',
    required: false,
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @ApiProperty({
    description: 'The assignee id of the task',
    example: 1,
    required: false,
  })
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  assigneeId?: number;

  @IsOptional()
  @ApiProperty({
    description: 'The creator id of the task',
    example: 1,
    required: false,
  })
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  creatorId?: number;

  @ApiProperty({
    description: 'The page number',
    example: 1,
    required: false,
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @IsOptional()
  @ApiProperty({
    description: 'The limit of the tasks',
    example: 10,
    required: false,
    default: 10,
  })
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;
}
