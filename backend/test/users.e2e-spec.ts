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

describe('Users (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let agent: TestAgent;

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

    await prisma.user.create({
      data: {
        email: userCreds.email,
        name: userCreds.name,
        role: Role.USER,
        passwordHash: await bcryptjs.hash(userCreds.password, 10),
      },
    });

    agent = request.agent(app.getHttpServer());
    const loginRes = await agent
      .post('/auth/login')
      .send({ email: userCreds.email, password: userCreds.password });

    expect(loginRes.status).toBe(200);
  });

  describe('GET /users', () => {
    it('should return all users and return 200', async () => {
      await prisma.user.create({
        data: {
          email: 'user2@example.com',
          name: 'User 2',
          role: Role.USER,
          passwordHash: await bcryptjs.hash('password123', 10),
        },
      });

      const res = await agent.get('/users');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            email: expect.any(String),
            name: expect.any(String),
          }),
        ]),
      );

      for (const u of res.body) {
        expect(Object.keys(u).sort()).toEqual(['email', 'id', 'name']);
      }
    });

    it('should return 401 if not authenticated', async () => {
      const res = await request(app.getHttpServer()).get('/users');
      expect(res.status).toBe(401);
    });
  });
});
