import { Injectable, NotFoundException } from '@nestjs/common';
import { RedisService } from 'src/common/redis/redis.service';
import { Task } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginatedResponse } from 'src/types/paginated-response';

import {
  ALL_TASK_CACHE_KEY,
  GET_TASKS_CACHE_KEY,
  TASK_TTL,
} from './constants/redis.constant';
import { TASK_INCLUDE_CONSTANT } from './constants/task-include-constant';
import { TaskCreateDto } from './dto/task-create.dto';
import { TaskQueryDto } from './dto/task-query.dto';
import { TaskUpdateDto } from './dto/task-update.dto';
import { TasksRealtimeService } from './tasks-realtime.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    private readonly tasksRealtime: TasksRealtimeService,
  ) {}

  async createTask(userId: number, createTaskDto: TaskCreateDto) {
    const task = await this.prisma.task.create({
      data: {
        ...createTaskDto,
        creatorId: userId,
      },
      include: TASK_INCLUDE_CONSTANT,
    });

    await this.redisService.deleteKeysByPattern(ALL_TASK_CACHE_KEY);
    this.tasksRealtime.emitTaskCreated(task);

    return task;
  }

  async getTasks(taskQueryDto: TaskQueryDto): Promise<PaginatedResponse<Task>> {
    const { status, assigneeId, creatorId, page, limit } = taskQueryDto;

    const where = {
      ...(status && { status }),
      ...(assigneeId && { assigneeId }),
      ...(creatorId && { creatorId }),
    };

    const cacheKey = GET_TASKS_CACHE_KEY(taskQueryDto);
    const cacheKeys =
      await this.redisService.get<PaginatedResponse<Task>>(cacheKey);

    if (cacheKeys) {
      return cacheKeys;
    }

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        skip: ((page ?? 1) - 1) * (limit ?? 10),
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: TASK_INCLUDE_CONSTANT,
      }),
      this.prisma.task.count({ where }),
    ]);

    await this.redisService.set(
      cacheKey,
      {
        content: tasks,
        total: total || 0,
        page: page ?? 1,
        limit: limit ?? 10,
        totalPages: Math.ceil(total / (limit ?? 10)) || 0,
      },
      TASK_TTL,
    );

    return {
      content: tasks,
      total,
      page: page ?? 1,
      limit: limit ?? 10,
      totalPages: Math.ceil(total / (limit ?? 10)),
    };
  }

  async getTask(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: TASK_INCLUDE_CONSTANT,
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async updateTask(id: string, updateTaskDto: TaskUpdateDto) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: TASK_INCLUDE_CONSTANT,
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (updateTaskDto.assigneeId) {
      const assignee = await this.prisma.user.findUnique({
        where: { id: updateTaskDto.assigneeId },
      });

      if (!assignee) {
        throw new NotFoundException('Assignee not found');
      }
    }

    const updatedTask = await this.prisma.task.update({
      where: { id: task.id },
      data: updateTaskDto,
      include: TASK_INCLUDE_CONSTANT,
    });
    await this.redisService.deleteKeysByPattern(ALL_TASK_CACHE_KEY);
    this.tasksRealtime.emitTaskUpdated(updatedTask);

    return updatedTask;
  }

  async deleteTask(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: TASK_INCLUDE_CONSTANT,
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const deletedTask = await this.prisma.task.delete({
      where: { id: task.id },
      include: TASK_INCLUDE_CONSTANT,
    });
    await this.redisService.deleteKeysByPattern(ALL_TASK_CACHE_KEY);
    this.tasksRealtime.emitTaskDeleted(deletedTask);

    return deletedTask;
  }
}
