import { IsNumber } from 'class-validator';
import { SeatCategory } from '../seat-category.enum';
import { Type } from 'class-transformer';

export class SeatDTO {
  show_id: number;
  seat_number: number;
  grade: string;
  price: number;
}

export class SeatInfoDTO {
  @Type(() => Number)
  V_SEATS: number;
  @Type(() => Number)
  V_PRICE: number;

  @Type(() => Number)
  R_SEATS: number;
  @Type(() => Number)
  R_PRICE: number;

  @Type(() => Number)
  S_SEATS: number;
  @Type(() => Number)
  S_PRICE: number;

  @Type(() => Number)
  A_SEATS: number;
  @Type(() => Number)
  A_PRICE: number;

  @IsNumber({}, { message: '최대 좌석은 숫자만 입력해 주세요.' })
  @Type(() => Number)
  max_seat: number;
}

export class RegistSeatDTO {
  show_id: number;
  seat_number: number;
  grade: SeatCategory;
  price: number;
}
