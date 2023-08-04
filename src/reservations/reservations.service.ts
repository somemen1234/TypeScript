import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ReservationSeatInfoDTO } from './dto/reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entity/reservation.entity';
import { DataSource, Repository } from 'typeorm';
import { ReservationDetailService } from 'src/reservation_details/reservation_details.service';
import { SeatService } from 'src/seats/seats.service';
import { UserService } from 'src/users/users.service';
import { ShowService } from 'src/shows/shows.service';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    private dataSource: DataSource,
    private reservationDetailService: ReservationDetailService,
    private seatService: SeatService,
    private userService: UserService
  ) {}
  async reservation(
    reservationDTO: Array<ReservationSeatInfoDTO>,
    userId: number,
    showId: number,
    totalPrice: number,
    userPoint: number
  ): Promise<any> {
    const createReservation = await this.reservationRepository.create({
      show: { id: showId },
      user: { id: userId },
      total_price: totalPrice,
    });
    const { id } = await this.reservationRepository.save(createReservation);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('READ COMMITTED');
    try {
      for (let i = 0; i < reservationDTO.length; i++) {
        reservationDTO[i].reservation_id = id;
        await this.reservationDetailService.createReservationDetail(reservationDTO[i], queryRunner.manager);
        await this.seatService.updateSeatStatus(reservationDTO[i].seat_id, queryRunner.manager);
      }
      await this.userService.pointDeduction(userId, totalPrice, userPoint, queryRunner.manager);
      await queryRunner.commitTransaction();
    } catch (transactionError) {
      console.error(transactionError);
      await queryRunner.rollbackTransaction();
      await this.reservationRepository.delete(id);
      throw new HttpException('트랜잭션 에러 발생', HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      queryRunner.release();
    }
  }

  async getMyReservations(userId: number): Promise<any> {
    const reservations = await this.reservationRepository
      .createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.reservation_details', 'detail')
      .select(['reservation.id', 'total_price', 'reservation.reservation_status'])
      .addSelect('COUNT(detail.id) AS ReservationSeats')
      .where('reservation.user_id = :user_id ', { user_id: userId })
      .groupBy('reservation.id')
      .orderBy('reservation.created_at', 'DESC')
      .getRawMany();

    return reservations;
  }

  async findMyReservation(userId: number, reservaitonId: number): Promise<any> {
    const existReservation = await this.reservationRepository.findOne({ where: { id: reservaitonId, user: { id: userId } } });

    if (!existReservation) throw new HttpException('해당 예약 정보가 존재하지 않습니다.', HttpStatus.BAD_REQUEST);
    if (existReservation.reservation_status === false) throw new HttpException('취소된 예약정보입니다. ', HttpStatus.BAD_REQUEST);
  }

  async validateMyReservation(userId: number, reservaitonId: number): Promise<any> {
    const existReservation = await this.reservationRepository
      .createQueryBuilder('reservation')
      .innerJoinAndSelect('reservation.show', 'show')
      .select(['reservation.id', 'reservation.reservation_status', 'reservation.total_price', 'show.id', 'show.show_time'])
      .where('reservation.user_id = :user_id and reservation.id = :reservation_id', {
        user_id: userId,
        reservation_id: reservaitonId,
      })
      .getOne();

    if (!existReservation) throw new HttpException('해당 예약 정보가 존재하지 않습니다.', HttpStatus.BAD_REQUEST);
    if (existReservation.reservation_status === false)
      throw new HttpException('이미 취소된 예약정보 입니다. ', HttpStatus.BAD_REQUEST);

    const showTime = new Date(existReservation.show.show_time);
    const currentTime = new Date(Date.now());
    showTime.setHours(showTime.getHours() - 3);
    if (showTime < currentTime) throw new HttpException('공연 시작 3시간 전에는 취소하실 수 없습니다. ', HttpStatus.BAD_REQUEST);

    return existReservation.total_price;
  }

  async getMyDetailReservations(userId: number, reservaitonId: number): Promise<any> {
    const reservations = await this.reservationRepository
      .createQueryBuilder('reservation')
      .innerJoinAndSelect('reservation.reservation_details', 'detail')
      .innerJoinAndSelect('detail.seat', 'seat')
      .select(['detail.id', 'seat_id', 'seat_number', 'grade', 'price'])
      .where('reservation.user_id = :user_id and reservation.id = :reservation_id', {
        user_id: userId,
        reservation_id: reservaitonId,
      })
      .getRawMany();
    return reservations;
  }

  async cancelReservation(userId: number, reservaitonId: number, userPoint: number, totalPrice: number): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('READ COMMITTED');

    await this.reservationRepository.update({ id: reservaitonId }, { reservation_status: false });
    try {
      const seatIds = await this.reservationDetailService.cancelReservation(reservaitonId, queryRunner.manager);

      for (let i = 0; i < seatIds.length; i++) {
        await this.seatService.cancelSeatStatus(seatIds[i], queryRunner.manager);
      }
      await this.userService.pointRefund(userId, totalPrice, userPoint, queryRunner.manager);
      await queryRunner.commitTransaction();
    } catch (transactionError) {
      console.error(transactionError);
      await queryRunner.rollbackTransaction();
      await this.reservationRepository.update({ id: reservaitonId }, { reservation_status: true });
      throw new HttpException('트랜잭션 에러 발생', HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      queryRunner.release();
    }
  }
}
