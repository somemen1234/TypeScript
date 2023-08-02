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
    const createSeat = await this.showRepository.create({
      ...seatDTO,
      show: { id: seatDTO.show_id },
    });
    await transactionManger.getRepository(Seat).save(createSeat);
  }
}
