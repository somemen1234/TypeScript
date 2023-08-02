import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache
  ) {}

  async get(key: string): Promise<any> {
    return await this.cache.get(key);
  }

  async set(key: string, value: any, ttl?: any): Promise<any> {
    console.log(key, value, ttl);
    return await this.cache.set(key, value, ttl);
  }

  async reset() {
    await this.cache.reset();
  }

  async delete(key: string) {
    await this.cache.del(key);
  }
}
