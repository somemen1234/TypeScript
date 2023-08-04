import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Reservation_Detail } from './entity/reservation_detail.entity';
import { ReservationSeatInfoDTO } from 'src/reservations/dto/reservation.dto';

@Injectable()
export class ReservationDetailService {
  async createReservationDetail(reservationDTO: ReservationSeatInfoDTO, transactionManger: EntityManager): Promise<void> {
    console.log(reservationDTO);
    const createReservationDetail = await transactionManger.getRepository(Reservation_Detail).create({
      reservation: { id: reservationDTO.reservation_id },
      seat: { id: reservationDTO.seat_id },
    });

    await transactionManger.getRepository(Reservation_Detail).save(createReservationDetail);
  }

  async cancelReservation(reservationId: number, transactionManger: EntityManager): Promise<any> {
    const seatIdArr = [];
    const seatIds = await transactionManger
      .createQueryBuilder(Reservation_Detail, 'detail')
      .where('detail.reservation_id = :reservationId', { reservationId })
      .select('detail.seat_id AS seatId')
      .getRawMany();

    for (let i = 0; i < seatIds.length; i++) {
      seatIdArr.push(seatIds[i].seatId);
    }

    await transactionManger.getRepository(Reservation_Detail).delete({ reservation: { id: reservationId } });

    return seatIdArr;
  }
}
