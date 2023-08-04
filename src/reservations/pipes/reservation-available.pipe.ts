import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ReservationSeatInfoDTO } from '../dto/reservation.dto';
import { SeatService } from 'src/seats/seats.service';

export class ReservationAvailablePipe implements PipeTransform {
  constructor(readonly seatService: SeatService) {}
  transform(value: Array<ReservationSeatInfoDTO>) {
    let arr = [];
    for (let i = 0; i < value.length; i++) {
      if (!(value[i].seat_number / 1)) throw new BadRequestException('좌석 번호는 0보다 큰 양의 정수만 입력 가능합니다.');
      value[i].seat_number = Number(value[i].seat_number);
      if (arr.includes(value[i].seat_number)) throw new BadRequestException('중복된 좌석 예매는 불가능합니다.');
      arr.push(value[i].seat_number);
    }
    return value;
  }
}
