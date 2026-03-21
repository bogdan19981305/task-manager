import { Cache } from '@nestjs/cache-manager';
import { Injectable, NotFoundException } from '@nestjs/common';
import { RedisService } from 'src/common/redis/redis.service';
import { Task } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

import { GET_TASKS_CACHE_KEY } from './constants/redis.constant';
import { TASK_INCLUDE_CONSTANT } from './constants/task-include-constant';
import { TaskCreateDto } from './dto/task-create.dto';
import { TaskQueryDto } from './dto/task-query.dto';
import { TaskUpdateDto } from './dto/task-update.dto';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async createTask(userId: number, createTaskDto: TaskCreateDto) {
    const task = await this.prisma.task.create({
      data: {
        ...createTaskDto,
        creatorId: userId,
      },
    });

    return task;
  }

  async getTasks(taskQueryDto: TaskQueryDto) {
    const { status, assigneeId, creatorId, page, limit } = taskQueryDto;

    const where = {
      ...(status && { status }),
      ...(assigneeId && { assigneeId }),
      ...(creatorId && { creatorId }),
    };

    const cachedTasks = await this.redisService.get(
      GET_TASKS_CACHE_KEY(taskQueryDto),
    );

    if (cachedTasks) {
      return cachedTasks as {
        content: Task[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
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

    await this.redisService.set(GET_TASKS_CACHE_KEY(taskQueryDto), {
      content: tasks,
      total,
      page: page ?? 1,
      limit: limit ?? 10,
      totalPages: Math.ceil(total / (limit ?? 10)),
    });

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

    return this.prisma.task.delete({
      where: { id: task.id },
      include: TASK_INCLUDE_CONSTANT,
    });
  }
}
