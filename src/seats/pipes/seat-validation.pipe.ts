import { BadRequestException, PipeTransform } from '@nestjs/common';
import { SeatInfoDTO } from '../dto/seat.dto';

export class SeatValidationPipe implements PipeTransform {
  transform(value: SeatInfoDTO) {
    const maxSeats = value.max_seat;

    if (maxSeats === value.A_SEATS + value.R_SEATS + value.S_SEATS + value.V_SEATS)
      throw new BadRequestException('등록한 좌석수와 세부 좌석수의 합이 일치하지 않습니다.');

    return value;
  }
}
