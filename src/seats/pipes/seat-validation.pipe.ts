import { BadRequestException, PipeTransform } from '@nestjs/common';
import { SeatInfoDTO } from '../dto/seat.dto';

export class SeatValidationPipe implements PipeTransform {
  transform(value: SeatInfoDTO) {
    const maxSeats = value.max_seat;
    const ASeat = value.A_SEATS || 0;
    const RSeat = value.R_SEATS || 0;
    const SSeat = value.S_SEATS || 0;
    const VSeat = value.V_SEATS || 0;

    if (maxSeats !== ASeat + RSeat + SSeat + VSeat)
      throw new BadRequestException('등록한 좌석수와 세부 좌석수의 합이 일치하지 않습니다.');

    if (value.A_SEATS && !value.A_PRICE)
      throw new BadRequestException('ARADE 등급의 좌석 수를 입력해 주셨다면 금액도 입력해 주셔야 합니다.');
    else if (value.R_SEATS && !value.R_PRICE)
      throw new BadRequestException('ROYAL 등급의 좌석 수를 입력해 주셨다면 금액도 입력해 주셔야 합니다.');
    else if (value.S_SEATS && !value.S_PRICE)
      throw new BadRequestException('SUPERIOR 등급의 좌석 수를 입력해 주셨다면 금액도 입력해 주셔야 합니다.');
    else if (value.V_SEATS && !value.V_PRICE)
      throw new BadRequestException('VIP 등급의 좌석 수를 입력해 주셨다면 금액도 입력해 주셔야 합니다.');
    return value;
  }
}
