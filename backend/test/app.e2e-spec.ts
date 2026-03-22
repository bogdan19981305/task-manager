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
import { PrismaService } from 'src/prisma/prisma.service';
import request from 'supertest';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

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

  afterEach(async () => {
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('POST /auth/register', () => {
    it('should register a user and return 201', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          passwordConfirmation: 'password123',
        });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        user: { email: 'test@example.com', name: 'Test User' },
      });
    });

    it('should return 400 if validation fails', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'test@example.com' });

      expect(res.status).toBe(400);
    });

    it('should return 400 if user exists', async () => {
      await prisma.user.create({
        data: {
          email: 'test@example.com',
          name: 'Test User',
          passwordHash: await bcryptjs.hash('password123', 10),
        },
      });

      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          passwordConfirmation: 'password123',
        });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        message: 'Email already in use',
        error: 'Bad Request',
        statusCode: 400,
      });
    });

    it('should return 400 if passwords do not match', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          passwordConfirmation: 'password1234',
        });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        message: 'Passwords do not match',
        error: 'Bad Request',
        statusCode: 400,
      });
    });
  });
});
