import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/users.module';
import { ReservationsModule } from './reservations/reservations.module';
import { ReservationDetailsModule } from './reservation_details/reservation_details.module';
import { SeatModule } from './seats/seats.module';
import { ShowModule } from './shows/shows.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from './configs/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { RedisCacheModule } from './cache/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useFactory: ormConfig }),
    RedisCacheModule,
    UserModule,
    ReservationsModule,
    ReservationDetailsModule,
    SeatModule,
    ShowModule,
  ],
  exports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
