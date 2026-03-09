import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from 'src/generated/prisma/client';

export class TaskUpdateDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsNumber()
  @IsOptional()
  assigneeId?: number;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsString()
  @IsOptional()
  content?: string;
}
