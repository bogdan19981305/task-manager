import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { StringValue } from 'ms';
import { RedisModule } from 'src/common/redis/redis.module';
import { PrismaModule } from 'src/prisma/prisma.module';

import { TaskAiService } from './task-ai.service';
import { TasksController } from './tasks.controller';
import { TasksGateway } from './tasks.gateway';
import { TasksService } from './tasks.service';
import { TasksRealtimeService } from './tasks-realtime.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService, TasksGateway, TasksRealtimeService, TaskAiService],
  imports: [
    PrismaModule,
    RedisModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => {
        const secret = config.getOrThrow<string>('JWT_SECRET');
        const expiresIn = config.getOrThrow<StringValue>('JWT_EXPIRES');
        return { secret, signOptions: { expiresIn } };
      },
    }),
  ],
})
export class TasksModule {}
