import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis, { Redis as RedisType } from 'ioredis';
@Injectable()
export class RedisService {
  private client: RedisType;
  constructor(private readonly configService: ConfigService) {
    this.client = new Redis({
      password: this.configService.getOrThrow<string>('REDIS_PASSWORD'),
      host: this.configService.getOrThrow<string>('REDIS_URL'),
    });
  }
  async get<T = any>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    return data ? (JSON.parse(data) as T) : null;
  }
  async set(key: string, value: any, ttlSeconds?: number) {
    const data = JSON.stringify(value);
    if (ttlSeconds) {
      await this.client.set(key, data, 'EX', ttlSeconds);
    } else {
      await this.client.set(key, data);
    }
  }
  async del(key: string) {
    await this.client.del(key);
  }
}
