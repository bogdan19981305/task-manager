import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Plan } from 'src/generated/prisma/client';
import { BillingInterval } from 'src/generated/prisma/enums';
import { PrismaService } from 'src/prisma/prisma.service';

import { PlanCreateDto } from './dto/plan-create.dto';
import { PlanUpdateDto } from './dto/plan-update.dto';
import { PublicPlanDto } from './dto/public-plan.dto';

@Injectable()
export class PlansService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Plan[]> {
    const plans: Plan[] = await this.prisma.plan.findMany({
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });
    return plans;
  }

  async findActivePublic(): Promise<PublicPlanDto[]> {
    const rows: PublicPlanDto[] = await this.prisma.plan.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
      select: {
        id: true,
        key: true,
        interval: true,
        name: true,
        description: true,
        price: true,
        currency: true,
        features: true,
        sortOrder: true,
        trialDays: true,
      },
    });
    return rows;
  }

  async findOne(id: number): Promise<Plan> {
    const plan = await this.prisma.plan.findUnique({ where: { id } });
    if (!plan) {
      throw new NotFoundException(`Plan with id ${id} not found`);
    }
    return plan;
  }

  async create(dto: PlanCreateDto): Promise<Plan> {
    try {
      return await this.prisma.plan.create({
        data: {
          key: dto.key,
          interval: dto.interval ?? BillingInterval.MONTH,
          trialDays:
            dto.trialDays === undefined || dto.trialDays === null
              ? null
              : dto.trialDays,
          name: dto.name,
          description: dto.description ?? null,
          price: dto.price,
          currency: dto.currency ?? 'usd',
          features: dto.features,
          permissions: dto.permissions,
          stripePriceId: dto.stripePriceId ?? null,
          stripeProductId: dto.stripeProductId ?? null,
          isActive: dto.isActive ?? true,
          sortOrder: dto.sortOrder ?? 0,
        },
      });
    } catch (e: unknown) {
      if (
        typeof e === 'object' &&
        e !== null &&
        'code' in e &&
        e.code === 'P2002'
      ) {
        throw new ConflictException(
          'A plan with this key and billing interval already exists',
        );
      }
      throw e;
    }
  }

  async update(id: number, dto: PlanUpdateDto): Promise<Plan> {
    await this.findOne(id);
    try {
      return await this.prisma.plan.update({
        where: { id },
        data: {
          ...(dto.key !== undefined && { key: dto.key }),
          ...(dto.interval !== undefined && { interval: dto.interval }),
          ...(dto.trialDays !== undefined && {
            trialDays: dto.trialDays === null ? null : dto.trialDays,
          }),
          ...(dto.name !== undefined && { name: dto.name }),
          ...(dto.description !== undefined && {
            description: dto.description,
          }),
          ...(dto.price !== undefined && { price: dto.price }),
          ...(dto.currency !== undefined && { currency: dto.currency }),
          ...(dto.features !== undefined && { features: dto.features }),
          ...(dto.permissions !== undefined && {
            permissions: dto.permissions,
          }),
          ...(dto.stripePriceId !== undefined && {
            stripePriceId: dto.stripePriceId,
          }),
          ...(dto.stripeProductId !== undefined && {
            stripeProductId: dto.stripeProductId,
          }),
          ...(dto.isActive !== undefined && { isActive: dto.isActive }),
          ...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder }),
        },
      });
    } catch (e: unknown) {
      if (
        typeof e === 'object' &&
        e !== null &&
        'code' in e &&
        e.code === 'P2002'
      ) {
        throw new ConflictException(
          'A plan with this key and billing interval already exists',
        );
      }
      throw e;
    }
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    try {
      await this.prisma.plan.delete({ where: { id } });
    } catch (e: unknown) {
      if (
        typeof e === 'object' &&
        e !== null &&
        'code' in e &&
        e.code === 'P2003'
      ) {
        throw new ConflictException(
          'Cannot delete plan: it is referenced by payments or user plans',
        );
      }
      throw e;
    }
  }
}
