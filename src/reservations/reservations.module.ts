import { Module } from '@nestjs/common';
import { ReservationController } from './reservations.controller';
import { ReservationService } from './reservations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entity/reservation.entity';
import { Seat } from 'src/seats/entity/seat.entity';
import { SeatService } from 'src/seats/seats.service';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { RedisCacheService } from 'src/cache/redis.service';
import { ReservationDetailService } from 'src/reservation_details/reservation_details.service';
import { Reservation_Detail } from 'src/reservation_details/entity/reservation_detail.entity';
import { UserService } from 'src/users/users.service';
import { User } from 'src/users/entity/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Reservation, Reservation_Detail, Seat]),
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '30m' },
    }),
  ],
  exports: [TypeOrmModule],
  controllers: [ReservationController],
  providers: [ReservationService, ReservationDetailService, SeatService, UserService, RedisCacheService],
})
export class ReservationModule {}
