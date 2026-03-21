import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from 'src/common/redis/redis.service';
import { Role, Task, TaskStatus, User } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginatedResponse } from 'src/types/paginated-response';

import { TaskQueryDto } from './dto/task-query.dto';
import { TasksService } from './tasks.service';

const mockTask: Task = {
  id: '1',
  title: 'Test Task',
  content: 'Test Content',
  status: TaskStatus.TODO,
  creatorId: 1,
  assigneeId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPaginatedResponse: PaginatedResponse<Task> = {
  content: [mockTask],
  total: 1,
  page: 1,
  limit: 10,
  totalPages: 1,
};

const mockEmptyPaginatedResponse: PaginatedResponse<Task> = {
  content: [],
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
};

const mockTaskQueryDto: TaskQueryDto = {
  page: 1,
  limit: 10,
  status: TaskStatus.TODO,
  assigneeId: 1,
  creatorId: 1,
};

const mockUser: User = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  createdAt: new Date(),
  updatedAt: new Date(),
  googleId: '1234567890',
  githubId: '1234567890',
  passwordHash: '1234567890',
  role: Role.USER,
};

const mockRedisService = {
  get: jest.fn(),
  set: jest.fn(),
  deleteKeysByPattern: jest.fn(),
};

const mockPrismaService = {
  task: {
    findUnique: jest.fn().mockResolvedValue(mockTask),
    findMany: jest.fn().mockResolvedValue([mockTask]),
    create: jest.fn().mockResolvedValue(mockTask),
    update: jest.fn().mockResolvedValue(mockTask),
    delete: jest.fn().mockResolvedValue(mockTask),
    count: jest.fn().mockResolvedValue(1),
  },
  user: {
    findUnique: jest.fn().mockResolvedValue(mockUser),
  },
};

describe('TasksService', () => {
  let tasksService: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
  });

  describe('createTask', () => {
    it('should create a task', async () => {
      const task = await tasksService.createTask(1, {
        title: 'Test Task',
        content: 'Test Content',
        assigneeId: 1,
      });
      expect(task).toEqual(mockTask);
    });
  });

  describe('getTasks', () => {
    it('should get tasks', async () => {
      const tasks: PaginatedResponse<Task> =
        await tasksService.getTasks(mockTaskQueryDto);
      expect(tasks).toEqual(mockPaginatedResponse);
    });

    it('return empty array if no tasks are found', async () => {
      mockPrismaService.task.findMany.mockResolvedValueOnce([]);
      mockPrismaService.task.count.mockResolvedValueOnce(0);

      const tasks = await tasksService.getTasks(mockTaskQueryDto);

      expect(tasks).toEqual(mockEmptyPaginatedResponse);
    });
  });

  describe('getTask', () => {
    it('should get a task', async () => {
      const task = await tasksService.getTask('1');
      expect(task).toEqual(mockTask);
    });

    it('should throw an error if the task is not found', async () => {
      mockPrismaService.task.findUnique.mockResolvedValueOnce(null);
      await expect(tasksService.getTask('1')).rejects.toThrow(
        new NotFoundException('Task not found'),
      );
    });
  });

  describe('updateTask', () => {
    it('should update a task', async () => {
      const task = await tasksService.updateTask('1', {
        title: 'Test Task',
      });
      expect(task).toEqual(mockTask);
    });

    it('should throw an error if the task is not found', async () => {
      mockPrismaService.task.findUnique.mockResolvedValueOnce(null);
      await expect(
        tasksService.updateTask('1', {
          title: 'Test Task',
        }),
      ).rejects.toThrow(new NotFoundException('Task not found'));
    });

    it('should throw an error if the assignee is not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(null);
      await expect(
        tasksService.updateTask('1', {
          assigneeId: 1,
        }),
      ).rejects.toThrow(new NotFoundException('Assignee not found'));
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      const task = await tasksService.deleteTask('1');
      expect(task).toEqual(mockTask);
    });

    it('should throw an error if the task is not found', async () => {
      mockPrismaService.task.findUnique.mockResolvedValueOnce(null);
      await expect(tasksService.deleteTask('1')).rejects.toThrow(
        new NotFoundException('Task not found'),
      );
    });
  });
});
