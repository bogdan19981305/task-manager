import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis, { Redis as RedisType } from 'ioredis';
@Injectable()
export class RedisService {
  private client: RedisType;
  constructor(private readonly configService: ConfigService) {
    this.client = new Redis({
      password: this.configService.getOrThrow<string>('REDIS_PASSWORD'),
      host: this.configService.getOrThrow<string>('REDIS_HOST'),
      port: this.configService.getOrThrow<number>('REDIS_PORT'),
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

  getKeysByPattern(key: string) {
    return new Promise<string[]>((resolve) => {
      const stream = this.client.scanStream({
        match: key,
        count: 100,
      });

      const keys: string[] = [];
      stream.on('data', (resultKeys) => {
        keys.push(...resultKeys);
      });
      stream.on('end', () => resolve(keys));
    });
  }

  async deleteKeysByPattern(key: string) {
    const keys = await this.getKeysByPattern(key);
    if (keys.length === 0) return;
    await this.client.unlink(keys);
  }
}
