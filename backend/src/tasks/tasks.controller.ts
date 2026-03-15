import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserEntity } from 'src/auth/entities/user.entity';
import { Task } from 'src/generated/prisma/client';

import { TaskCreateDto } from './dto/task-create.dto';
import { TaskQueryDto } from './dto/task-query.dto';
import { TaskUpdateDto } from './dto/task-update.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Auth()
  @Post()
  createTask(
    @CurrentUser() user: UserEntity,
    @Body() createTaskDto: TaskCreateDto,
  ): Promise<Task> {
    return this.tasksService.createTask(user.id, createTaskDto);
  }

  @Auth()
  @Get()
  getTasks(@Query() taskQueryDto: TaskQueryDto) {
    return this.tasksService.getTasks(taskQueryDto);
  }

  @Auth()
  @Get(':id')
  getTask(@Param('id') id: string) {
    return this.tasksService.getTask(id);
  }

  @Auth()
  @Patch(':id')
  updateTask(@Param('id') id: string, @Body() updateTaskDto: TaskUpdateDto) {
    return this.tasksService.updateTask(id, updateTaskDto);
  }

  @Auth()
  @Delete(':id')
  deleteTask(@Param('id') id: string) {
    return this.tasksService.deleteTask(id);
  }
}
