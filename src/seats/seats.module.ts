import { Module } from '@nestjs/common';
import { SeatController } from './seats.controller';
import { SeatService } from './seats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seat } from './entity/seat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Seat])],
  exports: [TypeOrmModule, SeatService],
  controllers: [SeatController],
  providers: [SeatService],
})
export class SeatModule {}
