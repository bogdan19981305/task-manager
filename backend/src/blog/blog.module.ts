import { Module } from '@nestjs/common';
import { RedisModule } from 'src/common/redis/redis.module';
import { PrismaModule } from 'src/prisma/prisma.module';

import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
