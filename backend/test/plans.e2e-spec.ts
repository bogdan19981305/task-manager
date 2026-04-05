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
import { PlanKey, Role } from 'src/generated/prisma/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import request from 'supertest';
import type TestAgent from 'supertest/lib/agent';

const userCreds = {
  email: 'plans-user@example.com',
  name: 'Plans User',
  password: 'password123',
};

const adminCreds = {
  email: 'plans-admin@example.com',
  name: 'Plans Admin',
  password: 'password123',
};

async function resetDb(prisma: PrismaService): Promise<void> {
  await prisma.payment.deleteMany();
  await prisma.userPlan.deleteMany();
  await prisma.task.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.plan.deleteMany();
  await prisma.user.deleteMany();
}

describe('Plans (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

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
    await resetDb(prisma);

    await prisma.user.create({
      data: {
        email: userCreds.email,
        name: userCreds.name,
        role: Role.USER,
        passwordHash: await bcryptjs.hash(userCreds.password, 10),
      },
      select: { id: true },
    });

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

  describe('GET /plans', () => {
    it('should list only active plans without authentication', async () => {
      await prisma.plan.createMany({
        data: [
          {
            key: PlanKey.STARTER,
            name: 'Starter',
            price: 0,
            features: ['f1'],
            permissions: ['p1'],
            isActive: true,
            sortOrder: 1,
          },
          {
            key: PlanKey.PRO,
            name: 'Pro',
            price: 100,
            features: ['f2'],
            permissions: ['p2'],
            isActive: false,
            sortOrder: 0,
          },
        ],
      });

      const res = await request(app.getHttpServer()).get('/plans');

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0]).toEqual(
        expect.objectContaining({
          key: PlanKey.STARTER,
          name: 'Starter',
          price: 0,
          currency: 'usd',
          features: ['f1'],
          sortOrder: 1,
        }),
      );
      expect(res.body[0]).not.toHaveProperty('permissions');
    });
  });

  describe('GET /admin/plans', () => {
    it('should return 401 without authentication', async () => {
      const res = await request(app.getHttpServer()).get('/admin/plans');
      expect(res.status).toBe(401);
    });

    it('should return 403 for a non-admin user', async () => {
      const res = await userAgent.get('/admin/plans');
      expect(res.status).toBe(403);
    });

    it('should return all plans for admin', async () => {
      await prisma.plan.create({
        data: {
          key: PlanKey.STARTER,
          name: 'S',
          price: 0,
          features: [],
          permissions: [],
          isActive: false,
        },
      });

      const res = await adminAgent.get('/admin/plans');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0]).toEqual(
        expect.objectContaining({
          key: PlanKey.STARTER,
          name: 'S',
          isActive: false,
          permissions: [],
        }),
      );
    });
  });

  describe('POST /admin/plans', () => {
    const validBody = {
      key: PlanKey.PREMIUM,
      name: 'Premium',
      description: 'Top tier',
      price: 4900,
      currency: 'usd',
      features: ['Everything'],
      permissions: ['tasks:read'],
    };

    it('should create a plan and return 201', async () => {
      const res = await adminAgent.post('/admin/plans').send(validBody);

      expect(res.status).toBe(201);
      expect(res.body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          key: PlanKey.PREMIUM,
          name: 'Premium',
          description: 'Top tier',
          price: 4900,
          currency: 'usd',
          features: ['Everything'],
          permissions: ['tasks:read'],
        }),
      );
    });

    it('should return 409 when key already exists', async () => {
      await prisma.plan.create({
        data: {
          key: PlanKey.STARTER,
          name: 'Existing',
          price: 0,
          features: [],
          permissions: [],
        },
      });

      const res = await adminAgent.post('/admin/plans').send({
        ...validBody,
        key: PlanKey.STARTER,
      });

      expect(res.status).toBe(409);
    });

    it('should return 400 when validation fails', async () => {
      const res = await adminAgent.post('/admin/plans').send({ name: 'Only' });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /admin/plans/:id', () => {
    it('should return 404 when plan not found', async () => {
      const res = await adminAgent.get('/admin/plans/99999');
      expect(res.status).toBe(404);
    });

    it('should return a plan by id', async () => {
      const plan = await prisma.plan.create({
        data: {
          key: PlanKey.STARTER,
          name: 'S',
          price: 0,
          features: ['a'],
          permissions: ['b'],
        },
      });

      const res = await adminAgent.get(`/admin/plans/${plan.id}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(
        expect.objectContaining({
          id: plan.id,
          key: PlanKey.STARTER,
          name: 'S',
        }),
      );
    });
  });

  describe('PATCH /admin/plans/:id', () => {
    it('should update a plan', async () => {
      const plan = await prisma.plan.create({
        data: {
          key: PlanKey.STARTER,
          name: 'Old',
          price: 0,
          features: [],
          permissions: [],
        },
      });

      const res = await adminAgent
        .patch(`/admin/plans/${plan.id}`)
        .send({ name: 'New' });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('New');
    });
  });

  describe('DELETE /admin/plans/:id', () => {
    it('should delete a plan', async () => {
      const plan = await prisma.plan.create({
        data: {
          key: PlanKey.STARTER,
          name: 'Del',
          price: 0,
          features: [],
          permissions: [],
        },
      });

      const res = await adminAgent.delete(`/admin/plans/${plan.id}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ ok: true });

      const gone = await prisma.plan.findUnique({ where: { id: plan.id } });
      expect(gone).toBeNull();
    });

    it('should return 409 when plan is referenced by a payment', async () => {
      const plan = await prisma.plan.create({
        data: {
          key: PlanKey.STARTER,
          name: 'Locked',
          price: 0,
          features: [],
          permissions: [],
        },
      });

      const user = await prisma.user.findFirstOrThrow({
        where: { email: adminCreds.email },
      });

      await prisma.payment.create({
        data: {
          userId: user.id,
          planId: plan.id,
          amount: 100,
          currency: 'usd',
        },
      });

      const res = await adminAgent.delete(`/admin/plans/${plan.id}`);
      expect(res.status).toBe(409);
    });
  });
});
