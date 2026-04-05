import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Plan } from 'src/generated/prisma/client';
import { PlanKey } from 'src/generated/prisma/enums';
import { PrismaService } from 'src/prisma/prisma.service';

import { PlansService } from './plans.service';

const mockPlan: Plan = {
  id: 1,
  key: PlanKey.STARTER,
  name: 'Starter',
  description: null,
  price: 0,
  currency: 'usd',
  features: ['A'],
  permissions: ['tasks:read'],
  stripePriceId: null,
  stripeProductId: null,
  isActive: true,
  sortOrder: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPrismaService = {
  plan: {
    findMany: jest.fn().mockResolvedValue([mockPlan]),
    findUnique: jest.fn().mockResolvedValue(mockPlan),
    create: jest.fn().mockResolvedValue(mockPlan),
    update: jest.fn().mockResolvedValue(mockPlan),
    delete: jest.fn().mockResolvedValue(mockPlan),
  },
};

describe('PlansService', () => {
  let service: PlansService;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockPrismaService.plan.findMany.mockResolvedValue([mockPlan]);
    mockPrismaService.plan.findUnique.mockResolvedValue(mockPlan);
    mockPrismaService.plan.create.mockResolvedValue(mockPlan);
    mockPrismaService.plan.update.mockResolvedValue(mockPlan);
    mockPrismaService.plan.delete.mockResolvedValue(mockPlan);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlansService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<PlansService>(PlansService);
  });

  describe('findAll', () => {
    it('should return plans ordered by sortOrder and id', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockPlan]);
      expect(mockPrismaService.plan.findMany).toHaveBeenCalledWith({
        orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
      });
    });
  });

  describe('findActivePublic', () => {
    it('should return only active plans with public fields', async () => {
      const publicRow = {
        id: 1,
        key: PlanKey.STARTER,
        name: 'Starter',
        description: null,
        price: 0,
        currency: 'usd',
        features: ['A'],
        sortOrder: 0,
      };
      mockPrismaService.plan.findMany.mockResolvedValueOnce([publicRow]);

      const result = await service.findActivePublic();
      expect(result).toEqual([publicRow]);
      expect(mockPrismaService.plan.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
        select: {
          id: true,
          key: true,
          name: true,
          description: true,
          price: true,
          currency: true,
          features: true,
          sortOrder: true,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a plan by id', async () => {
      const plan = await service.findOne(1);
      expect(plan).toEqual(mockPlan);
    });

    it('should throw NotFoundException when missing', async () => {
      mockPrismaService.plan.findUnique.mockResolvedValueOnce(null);
      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException('Plan with id 999 not found'),
      );
    });
  });

  describe('create', () => {
    it('should create a plan', async () => {
      const dto = {
        key: PlanKey.PRO,
        name: 'Pro',
        price: 2900,
        features: ['x'],
        permissions: ['tasks:write'],
      };
      const created = await service.create(dto);
      expect(created).toEqual(mockPlan);
      expect(mockPrismaService.plan.create).toHaveBeenCalledWith({
        data: {
          key: dto.key,
          name: dto.name,
          description: null,
          price: dto.price,
          currency: 'usd',
          features: dto.features,
          permissions: dto.permissions,
          stripePriceId: null,
          stripeProductId: null,
          isActive: true,
          sortOrder: 0,
        },
      });
    });

    it('should map unique key violation to ConflictException', async () => {
      mockPrismaService.plan.create.mockRejectedValueOnce({ code: 'P2002' });
      await expect(
        service.create({
          key: PlanKey.STARTER,
          name: 'X',
          price: 1,
          features: [],
          permissions: [],
        }),
      ).rejects.toThrow(
        new ConflictException('A plan with this key already exists'),
      );
    });
  });

  describe('update', () => {
    it('should update a plan', async () => {
      const updated = await service.update(1, { name: 'Renamed' });
      expect(updated).toEqual(mockPlan);
      expect(mockPrismaService.plan.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException when plan missing', async () => {
      mockPrismaService.plan.findUnique.mockResolvedValueOnce(null);
      await expect(service.update(999, { name: 'N' })).rejects.toThrow(
        new NotFoundException('Plan with id 999 not found'),
      );
    });

    it('should map unique key violation to ConflictException', async () => {
      mockPrismaService.plan.update.mockRejectedValueOnce({ code: 'P2002' });
      await expect(service.update(1, { key: PlanKey.PREMIUM })).rejects.toThrow(
        new ConflictException('A plan with this key already exists'),
      );
    });
  });

  describe('remove', () => {
    it('should delete a plan', async () => {
      await service.remove(1);
      expect(mockPrismaService.plan.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException when plan missing', async () => {
      mockPrismaService.plan.findUnique.mockResolvedValueOnce(null);
      await expect(service.remove(999)).rejects.toThrow(
        new NotFoundException('Plan with id 999 not found'),
      );
    });

    it('should map foreign key violation to ConflictException', async () => {
      mockPrismaService.plan.delete.mockRejectedValueOnce({ code: 'P2003' });
      await expect(service.remove(1)).rejects.toThrow(
        new ConflictException(
          'Cannot delete plan: it is referenced by payments or user plans',
        ),
      );
    });
  });
});
