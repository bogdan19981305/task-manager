import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';

import { AdminPlansController } from './admin-plans.controller';
import { PlansService } from './plans.service';
import { PublicPlansController } from './public-plans.controller';

@Module({
  imports: [PrismaModule],
  controllers: [AdminPlansController, PublicPlansController],
  providers: [PlansService],
  exports: [PlansService],
})
export class PlansModule {}
