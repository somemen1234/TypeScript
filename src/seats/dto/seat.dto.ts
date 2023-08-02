import { IsNumber, MaxLength } from 'class-validator';
import { SeatCategory } from '../seat-category.enum';

export class SeatDTO {
  show_id: number;
  seat_number: number;
  grade: string;
  price: number;
  reservation: Boolean;
  create_at: Date;
  update_at: Date;
}

export class SeatInfoDTO {
  V_SEATS: number;
  V_PRICE: number;

  R_SEATS: number;
  R_PRICE: number;

  S_SEATS: number;
  S_PRICE: number;

  A_SEATS: number;
  A_PRICE: number;

  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: '최대 좌석은 숫자만 입력해 주세요.' })
  @MaxLength(40, { message: '공연장의 최대 좌석은 40좌석입니다. ' })
  max_seat: number;
}

export class RegistSeatDTO {
  show_id: number;
  seat_number: number;
  grade: SeatCategory;
  price: number;
}
