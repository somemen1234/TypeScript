import { Injectable } from '@nestjs/common';
import { RegistSeatDTO } from './dto/seat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Seat } from './entity/seat.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class SeatService {
  constructor(
    @InjectRepository(Seat)
    private showRepository: Repository<Seat>
  ) {}
  async saveSeat(seatDTO: RegistSeatDTO, transactionManger: EntityManager): Promise<void> {
    await transactionManger.getRepository(Seat).save(seatDTO);
  }
}
