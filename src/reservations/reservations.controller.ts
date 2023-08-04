import { Body, Controller, Post, Res, UseGuards, HttpStatus, Param, Get, HttpException, Delete } from '@nestjs/common';
import { ReservationService } from './reservations.service';
import { AuthGuard } from 'src/security/auth.guard';
import { ReservationSeatInfoDTO } from './dto/reservation.dto';
import { Response } from 'express';
import { GetUser } from 'src/security/get-user.decorator';
import { Payload } from 'src/security/payload.interface';
import { ReservationAvailablePipe } from './pipes/reservation-available.pipe';
import { SeatService } from 'src/seats/seats.service';

@Controller('reservation')
export class ReservationController {
  constructor(private reservationService: ReservationService, readonly seatService: SeatService) {}

  @Post(':showId')
  @UseGuards(AuthGuard)
  async reservationShow(
    @GetUser() user: Payload,
    @Param('showId') showId: number,
    @Body(ReservationAvailablePipe) reservaitonInfo: Array<ReservationSeatInfoDTO>,
    @Res() res: Response
  ): Promise<any> {
    let totalPrice = 0;
    for (let i = 0; i < reservaitonInfo.length; i++) {
      const seatInfo = await this.seatService.findSeat(reservaitonInfo[i].seat_number, showId);
      reservaitonInfo[i].seat_id = seatInfo.id;
      totalPrice += seatInfo.price;
    }
    if (user.point < totalPrice)
      throw new HttpException('잔여 포인트가 결제 금액보다 부족해 예매를 할 수 없습니다.', HttpStatus.BAD_REQUEST);
    await this.reservationService.reservation(reservaitonInfo, user.id, showId, totalPrice, user.point);
    return res.status(HttpStatus.CREATED).json({ message: '예약이 정상적으로 완료되었습니다. ' });
  }

  @Get('/myReservation')
  @UseGuards(AuthGuard)
  async myReservations(@GetUser() user: Payload, @Res() res: Response): Promise<any> {
    const reservations = await this.reservationService.getMyReservations(user.id);
    return res.status(HttpStatus.OK).json({ reservations });
  }

  @Get('/myReservation/:reservationId')
  @UseGuards(AuthGuard)
  async myDetailReservations(
    @GetUser() user: Payload,
    @Param('reservationId') reservationId: number,
    @Res() res: Response
  ): Promise<any> {
    await this.reservationService.findMyReservation(user.id, reservationId);

    const reservationDetails = await this.reservationService.getMyDetailReservations(user.id, reservationId);
    return res.status(HttpStatus.OK).json({ reservationDetails });
  }

  @Delete('/myReservation/:reservationId')
  @UseGuards(AuthGuard)
  async cancelReservation(
    @GetUser() user: Payload,
    @Param('reservationId') reservationId: number,
    @Res() res: Response
  ): Promise<any> {
    const totalPrice = await this.reservationService.validateMyReservation(user.id, reservationId);

    await this.reservationService.cancelReservation(user.id, reservationId, user.point, totalPrice);
    return res.status(HttpStatus.CREATED).json({ message: '예약이 정상적으로 취소 되었습니다. ' });
  }
}
