import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import type { Response } from 'express';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserEntity } from 'src/auth/entities/user.entity';
import { Task } from 'src/generated/prisma/client';
import { Role } from 'src/generated/prisma/enums';

import { TaskCreateDto } from './dto/task-create.dto';
import { TaskGenerateDescriptionDto } from './dto/task-generate-description.dto';
import { TaskQueryDto } from './dto/task-query.dto';
import { TaskUpdateDto } from './dto/task-update.dto';
import { TaskAiService } from './task-ai.service';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly taskAiService: TaskAiService,
  ) {}

  @ApiOperation({
    summary: 'Stream AI-generated task description (admin only)',
  })
  @ApiResponse({ status: 200, description: 'Plain text stream (UTF-8 chunks)' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 503, description: 'AI unavailable' })
  @ApiBody({ type: TaskGenerateDescriptionDto })
  @Auth(Role.ADMIN)
  @Post('generate-description')
  async generateDescription(
    @Body() body: TaskGenerateDescriptionDto,
    @Res({ passthrough: false }) res: Response,
  ): Promise<void> {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    try {
      for await (const chunk of this.taskAiService.streamTaskDescription(
        body.title,
      )) {
        res.write(chunk);
      }
      res.end();
    } catch {
      if (!res.headersSent) {
        res.status(503).end();
        return;
      }
      res.end();
    }
  }

  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBody({ description: 'The task to create', type: TaskCreateDto })
  @Auth()
  @Post()
  createTask(
    @CurrentUser() user: UserEntity,
    @Body() createTaskDto: TaskCreateDto,
  ): Promise<Task> {
    return this.tasksService.createTask(user.id, createTaskDto);
  }

  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({ status: 200, description: 'Tasks fetched successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Auth()
  @Get()
  getTasks(@Query() taskQueryDto: TaskQueryDto) {
    return this.tasksService.getTasks(taskQueryDto);
  }

  @ApiOperation({ summary: 'Get a task by id' })
  @ApiResponse({ status: 200, description: 'Task fetched successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiParam({ name: 'id', description: 'The id of the task', type: String })
  @Auth()
  @Get(':id')
  getTask(@Param('id') id: string) {
    return this.tasksService.getTask(id);
  }

  @ApiOperation({ summary: 'Update a task by id' })
  @ApiResponse({ status: 200, description: 'Task updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBody({ description: 'The task to update', type: TaskUpdateDto })
  @Auth()
  @Patch(':id')
  updateTask(@Param('id') id: string, @Body() updateTaskDto: TaskUpdateDto) {
    return this.tasksService.updateTask(id, updateTaskDto);
  }

  @ApiOperation({ summary: 'Delete a task by id' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiParam({ name: 'id', description: 'The id of the task', type: String })
  @Auth(Role.ADMIN)
  @Delete(':id')
  deleteTask(@Param('id') id: string) {
    return this.tasksService.deleteTask(id);
  }
}
