import { Module } from '@nestjs/common';
import { SeatController } from './seats.controller';
import { SeatService } from './seats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seat } from './entity/seat.entity';
import { ReservationService } from 'src/reservations/reservations.service';
import { Reservation } from 'src/reservations/entity/reservation.entity';
import { ReservationDetailService } from 'src/reservation_details/reservation_details.service';
import { Reservation_Detail } from 'src/reservation_details/entity/reservation_detail.entity';
import { UserService } from 'src/users/users.service';
import { User } from 'src/users/entity/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Seat, Reservation, Reservation_Detail, User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '30m' },
    }),
  ],
  exports: [TypeOrmModule, SeatService],
  controllers: [SeatController],
  providers: [SeatService, ReservationService, ReservationDetailService, UserService],
})
export class SeatModule {}
