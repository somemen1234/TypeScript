import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import * as dotenv from 'dotenv';
import { RedisCacheService } from './redis.service';
dotenv.config();

const cacheModule = CacheModule.register({
  useFactory: async () => {
    console.log('1111111111111111111111111111111111111111111111111111111111111');
    console.log(redisStore, process.env.REDIS_PORT);
    return {
      store: redisStore,
      host: 'localhost',
      port: process.env.REDIS_PORT,
      // ttl: '30m',
    };
  },
});

@Module({
  imports: [cacheModule],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisCacheModule {}
