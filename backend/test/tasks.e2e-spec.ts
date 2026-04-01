import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcryptjs from 'bcryptjs';
import cookieParser from 'cookie-parser';
import { AppModule } from 'src/app.module';
import { RedisService } from 'src/common/redis/redis.service';
import { Role } from 'src/generated/prisma/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import request from 'supertest';
import type TestAgent from 'supertest/lib/agent';

const userCreds = {
  email: 'user@example.com',
  name: 'User',
  password: 'password123',
};

const adminCreds = {
  email: 'admin@example.com',
  name: 'Admin',
  password: 'password123',
};

describe('Tasks (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  let userId: number;

  let userAgent: TestAgent;
  let adminAgent: TestAgent;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
    );
    await app.init();

    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    const redisService = app.get(RedisService);
    await redisService.getClient().quit();
    await app.close();
  });

  beforeEach(async () => {
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();

    const user = await prisma.user.create({
      data: {
        email: userCreds.email,
        name: userCreds.name,
        role: Role.USER,
        passwordHash: await bcryptjs.hash(userCreds.password, 10),
      },
      select: { id: true },
    });
    userId = user.id;

    await prisma.user.create({
      data: {
        email: adminCreds.email,
        name: adminCreds.name,
        role: Role.ADMIN,
        passwordHash: await bcryptjs.hash(adminCreds.password, 10),
      },
      select: { id: true },
    });

    userAgent = request.agent(app.getHttpServer());
    const userLoginRes = await userAgent
      .post('/auth/login')
      .send({ email: userCreds.email, password: userCreds.password });
    expect(userLoginRes.status).toBe(200);

    adminAgent = request.agent(app.getHttpServer());
    const adminLoginRes = await adminAgent
      .post('/auth/login')
      .send({ email: adminCreds.email, password: adminCreds.password });
    expect(adminLoginRes.status).toBe(200);
  });

  describe('POST /tasks', () => {
    it('should create a task and return 201', async () => {
      const res = await userAgent.post('/tasks').send({
        title: 'My task',
        content: 'Some content',
      });

      expect(res.status).toBe(201);
      expect(res.body).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          title: 'My task',
          content: 'Some content',
          creatorId: userId,
          assigneeId: null,
          status: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      );
    });

    it('should return 401 if not authenticated', async () => {
      const res = await request(app.getHttpServer()).post('/tasks').send({
        title: 'My task',
      });

      expect(res.status).toBe(401);
    });

    it('should return 400 if validation fails', async () => {
      const res = await userAgent.post('/tasks').send({});
      expect(res.status).toBe(400);
    });
  });

  describe('GET /tasks', () => {
    it('should return paginated tasks and return 200', async () => {
      await prisma.task.createMany({
        data: [
          { title: 'Task 1', content: 'C1', creatorId: userId },
          { title: 'Task 2', content: 'C2', creatorId: userId },
        ],
      });

      const res = await userAgent.get('/tasks').query({ page: 1, limit: 1 });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        content: expect.any(Array),
        total: 2,
        page: 1,
        limit: 1,
        totalPages: 2,
      });
      expect(res.body.content).toHaveLength(1);
      expect(res.body.content[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          title: expect.any(String),
          creatorId: userId,
          creator: {
            id: userId,
            email: userCreds.email,
            name: userCreds.name,
          },
          assignee: null,
        }),
      );
    });

    it('should return 401 if not authenticated', async () => {
      const res = await request(app.getHttpServer()).get('/tasks');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /tasks/:id', () => {
    it('should return a task by id and return 200', async () => {
      const task = await prisma.task.create({
        data: { title: 'Task', content: 'C', creatorId: userId },
      });

      const res = await userAgent.get(`/tasks/${task.id}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(
        expect.objectContaining({
          id: task.id,
          title: 'Task',
          content: 'C',
          creatorId: userId,
          creator: {
            id: userId,
            email: userCreds.email,
            name: userCreds.name,
          },
          assignee: null,
        }),
      );
    });

    it('should return 401 if not authenticated', async () => {
      const task = await prisma.task.create({
        data: { title: 'Task', content: 'C', creatorId: userId },
      });

      const res = await request(app.getHttpServer()).get(`/tasks/${task.id}`);
      expect(res.status).toBe(401);
    });

    it('should return 404 if task not found', async () => {
      const res = await userAgent.get('/tasks/does-not-exist');
      expect(res.status).toBe(404);
      expect(res.body).toEqual(
        expect.objectContaining({
          message: 'Task not found',
          statusCode: 404,
        }),
      );
    });
  });

  describe('PATCH /tasks/:id', () => {
    it('should update a task and return 200', async () => {
      const task = await prisma.task.create({
        data: { title: 'Task', content: 'C', creatorId: userId },
      });

      const res = await userAgent.patch(`/tasks/${task.id}`).send({
        title: 'Task updated',
        content: 'C2',
      });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(
        expect.objectContaining({
          id: task.id,
          title: 'Task updated',
          content: 'C2',
          creatorId: userId,
          creator: {
            id: userId,
            email: userCreds.email,
            name: userCreds.name,
          },
        }),
      );
    });

    it('should return 401 if not authenticated', async () => {
      const task = await prisma.task.create({
        data: { title: 'Task', content: 'C', creatorId: userId },
      });

      const res = await request(app.getHttpServer())
        .patch(`/tasks/${task.id}`)
        .send({ title: 'Nope' });

      expect(res.status).toBe(401);
    });

    it('should return 404 if task not found', async () => {
      const res = await userAgent.patch('/tasks/does-not-exist').send({
        title: 'Nope',
      });
      expect(res.status).toBe(404);
      expect(res.body).toEqual(
        expect.objectContaining({
          message: 'Task not found',
          statusCode: 404,
        }),
      );
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete a task and return 200', async () => {
      const task = await prisma.task.create({
        data: { title: 'Task', content: 'C', creatorId: userId },
      });

      const res = await adminAgent.delete(`/tasks/${task.id}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(
        expect.objectContaining({
          id: task.id,
          title: 'Task',
          content: 'C',
        }),
      );
    });

    it('should return 401 if not authenticated', async () => {
      const task = await prisma.task.create({
        data: { title: 'Task', content: 'C', creatorId: userId },
      });

      const res = await request(app.getHttpServer()).delete(
        `/tasks/${task.id}`,
      );
      expect(res.status).toBe(401);
    });

    it('should return 403 if not admin', async () => {
      const task = await prisma.task.create({
        data: { title: 'Task', content: 'C', creatorId: userId },
      });

      const res = await userAgent.delete(`/tasks/${task.id}`);
      expect(res.status).toBe(403);
    });
  });
});
