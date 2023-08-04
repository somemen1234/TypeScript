import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegistSeatDTO } from './dto/seat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Seat } from './entity/seat.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class SeatService {
  constructor(
    @InjectRepository(Seat)
    private seatRepository: Repository<Seat>
  ) {}
  async saveSeat(seatDTO: RegistSeatDTO, transactionManger: EntityManager): Promise<void> {
    const createSeat = await transactionManger.getRepository(Seat).create({ ...seatDTO, show: { id: seatDTO.show_id } });

    await transactionManger.getRepository(Seat).save(createSeat);
  }

  async findSeat(seatNumber: number, showId: number): Promise<any> {
    const existSeat = await this.seatRepository.findOne({ where: { show: { id: showId }, seat_number: seatNumber } });
    if (!existSeat || existSeat.reservation === true)
      throw new HttpException('선택한 좌석이 없거나 이미 예약된 좌석입니다.', HttpStatus.BAD_REQUEST);

    return existSeat;
  }

  async updateSeatStatus(id: number, transactionManger: EntityManager): Promise<any> {
    await transactionManger.getRepository(Seat).update({ id }, { reservation: true });
  }

  async cancelSeatStatus(id: number, transactionManger: EntityManager): Promise<any> {
    await transactionManger.getRepository(Seat).update({ id }, { reservation: false });
  }
}
