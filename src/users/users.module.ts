import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UploadMiddleware } from 'src/middlewares/upload.middleware';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/security/passport.jwt.strategy';
import { RedisCacheModule } from 'src/cache/redis.module';
import { RedisCacheService } from 'src/cache/redis.service';

@Module({
  imports: [
    RedisCacheModule,
    TypeOrmModule.forFeature([User]),
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '30m' },
    }),
  ],
  exports: [PassportModule, JwtStrategy],
  controllers: [UserController],
  providers: [UserService, JwtStrategy, RedisCacheService],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UploadMiddleware).forRoutes({ path: '/user/signUp', method: RequestMethod.POST });
  }
}
