import { Module } from '@nestjs/common';
import { ReservationDetailsController } from './reservation_details.controller';
import { ReservationDetailsService } from './reservation_details.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation_Detail } from './entity/reservation_detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation_Detail])],
  exports: [TypeOrmModule],
  controllers: [ReservationDetailsController],
  providers: [ReservationDetailsService],
})
export class ReservationDetailsModule {}
