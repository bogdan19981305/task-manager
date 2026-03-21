import { Module } from '@nestjs/common';
import { RedisModule } from 'src/common/redis/redis.module';
import { PrismaModule } from 'src/prisma/prisma.module';

import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  imports: [PrismaModule, RedisModule],
})
export class TasksModule {}
