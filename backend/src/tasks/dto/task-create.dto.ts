import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TaskCreateDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsInt()
  @IsOptional()
  assigneeId?: number;
}
