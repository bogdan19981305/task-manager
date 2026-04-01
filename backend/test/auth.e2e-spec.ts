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

const testUser = {
  email: 'test@example.com',
  name: 'Test User',
  password: 'password123',
};

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
          name: testUser.name,
          email: testUser.email,
          password: testUser.password,
          passwordConfirmation: testUser.password,
        });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        user: { email: testUser.email, name: testUser.name },
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

  describe('POST /auth/login', () => {
    it('should login a user and return 200', async () => {
      await prisma.user.create({
        data: {
          email: testUser.email,
          name: testUser.name,
          passwordHash: await bcryptjs.hash(testUser.password, 10),
        },
      });

      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: testUser.email, password: testUser.password });

      expect(res.status).toBe(200);
      expect(res.body.user).toEqual({
        email: testUser.email,
        name: testUser.name,
      });
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('should return 400 if validation fails', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: testUser.email });

      expect(res.status).toBe(400);
    });

    it('should return 401 if invalid credentials', async () => {
      await prisma.user.create({
        data: {
          email: testUser.email,
          name: testUser.name,
          passwordHash: await bcryptjs.hash(testUser.password, 10),
        },
      });

      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: testUser.email, password: '12345678910' });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /auth/logout', () => {
    it('should logout a user and return 200', async () => {
      await prisma.user.create({
        data: {
          email: testUser.email,
          name: testUser.name,
          passwordHash: await bcryptjs.hash(testUser.password, 10),
        },
      });

      const agent = request.agent(app.getHttpServer());
      const loginRes = await agent
        .post('/auth/login')
        .send({ email: testUser.email, password: testUser.password });

      expect(loginRes.status).toBe(200);

      const res = await agent.post('/auth/logout');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ ok: true });
    });

    it('should return 401 if not authenticated', async () => {
      const res = await request(app.getHttpServer()).post('/auth/logout');

      expect(res.status).toBe(401);
    });
  });

  describe('POST /auth/refresh', () => {
    it('should refresh a token and return 200', async () => {
      await prisma.user.create({
        data: {
          email: testUser.email,
          name: testUser.name,
          passwordHash: await bcryptjs.hash(testUser.password, 10),
        },
      });

      const agent = request.agent(app.getHttpServer());
      const loginRes = await agent
        .post('/auth/login')
        .send({ email: testUser.email, password: testUser.password });

      expect(loginRes.status).toBe(200);

      const res = await agent.post('/auth/refresh');
      expect(res.status).toBe(200);
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('should return 401 if not authenticated', async () => {
      const res = await request(app.getHttpServer()).post('/auth/refresh');

      expect(res.status).toBe(401);
    });
  });

  describe('GET /auth/me', () => {
    it('should return the current user and return 200', async () => {
      const user = await prisma.user.create({
        data: {
          email: testUser.email,
          name: testUser.name,
          passwordHash: await bcryptjs.hash(testUser.password, 10),
        },
      });

      const agent = request.agent(app.getHttpServer());
      const loginRes = await agent
        .post('/auth/login')
        .send({ email: testUser.email, password: testUser.password });

      expect(loginRes.status).toBe(200);

      const res = await agent.get('/auth/me');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        id: user.id,
        email: testUser.email,
        name: testUser.name,
        role: 'USER',
      });
    });

    it('should return 401 if not authenticated', async () => {
      const res = await request(app.getHttpServer()).get('/auth/me');

      expect(res.status).toBe(401);
    });
  });
});
