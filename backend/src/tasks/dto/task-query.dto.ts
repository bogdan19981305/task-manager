import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { TaskStatus } from 'src/generated/prisma/client';

export class TaskQueryDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  assigneeId?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  creatorId?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;
}
