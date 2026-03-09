import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TaskCreateDto } from './dto/task-create.dto';
import { TaskQueryDto } from './dto/task-query.dto';
import { TaskUpdateDto } from './dto/task-update.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

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

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        skip: ((page ?? 1) - 1) * (limit ?? 10),
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.task.count({ where }),
    ]);

    return {
      tasks,
      total,
      page: page ?? 1,
      limit: limit ?? 10,
      totalPages: Math.ceil(total / (limit ?? 10)),
    };
  }

  async getTask(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async updateTask(id: string, updateTaskDto: TaskUpdateDto) {
    const task = await this.prisma.task.findUnique({
      where: { id },
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

    return this.prisma.task.update({
      where: { id: task.id },
      data: updateTaskDto,
    });
  }

  async deleteTask(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return this.prisma.task.delete({
      where: { id: task.id },
    });
  }
}
