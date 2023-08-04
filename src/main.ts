import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: true });
  app.use(cookieParser());
  // app.useGlobalFilters(new HttpExceptionFilter()); //얘를 validationPipe내의 message가 전부 무시가 됨.
  app.useGlobalPipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } }));
  await app.listen(3000);
}
bootstrap();
