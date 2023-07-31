import { Injectable } from '@nestjs/common';
import { SeatDTO } from './dto/seat.dto';

@Injectable()
export class SeatService {
  async saveSeat(seatDTO: SeatDTO): Promise<void> {}
}
