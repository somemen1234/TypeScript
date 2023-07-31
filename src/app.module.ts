import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReservationsModule } from './reservations/reservations.module';
import { ReservationDetailsModule } from './reservation_details/reservation_details.module';
import { SeatsModule } from './seats/seats.module';
import { ShowsModule } from './shows/shows.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from './configs/typeorm.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useFactory: ormConfig }),
    UsersModule,
    ReservationsModule,
    ReservationDetailsModule,
    SeatsModule,
    ShowsModule,
  ],
  exports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
