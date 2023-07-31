import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ShowController } from './shows.controller';
import { ShowService } from './shows.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Show } from './entity/show.entity';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { UploadMiddleware } from 'src/middlewares/upload.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([Show]),
    ConfigModule.forRoot({ isGlobal: true }), //app.module에서 exports 했으니 import하기
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  exports: [TypeOrmModule],
  controllers: [ShowController],
  providers: [ShowService],
})
export class ShowsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UploadMiddleware).forRoutes({ path: '/show/register', method: RequestMethod.POST });
  }
}
