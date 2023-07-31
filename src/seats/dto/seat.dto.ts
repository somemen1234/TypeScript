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
}
