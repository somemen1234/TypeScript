import { Module } from '@nestjs/common';
import { ReservationDetailController } from './reservation_details.controller';
import { ReservationDetailService } from './reservation_details.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation_Detail } from './entity/reservation_detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation_Detail])],
  exports: [TypeOrmModule],
  controllers: [ReservationDetailController],
  providers: [ReservationDetailService],
})
export class ReservationDetailModule {}
