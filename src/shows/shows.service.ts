import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Show } from './entity/show.entity';
import { DataSource, Like, Repository } from 'typeorm';
import { ShowDTO, keywordDTO } from './dto/show.dto';
import { RegistSeatDTO, SeatInfoDTO } from 'src/seats/dto/seat.dto';
import { SeatCategory } from 'src/seats/seat-category.enum';
import { SeatService } from 'src/seats/seats.service';

@Injectable()
export class ShowService {
  constructor(
    @InjectRepository(Show)
    private showRepository: Repository<Show>,
    private dataSource: DataSource,
    private seatService: SeatService
  ) {}

  async register(showDTO: ShowDTO, seatInfoDTO: SeatInfoDTO): Promise<void> {
    const { V_SEATS, V_PRICE, R_SEATS, R_PRICE, S_SEATS, S_PRICE, A_SEATS, A_PRICE } = seatInfoDTO;
    let maxSeat = showDTO.max_seat;

    const exsitShow = await this.showRepository.findOne({
      where: { location: showDTO.location, show_time: showDTO.show_time },
    });
    if (exsitShow) throw new HttpException('이미 해당 시간과 해당 지역에 공연이 있습니다.', HttpStatus.CONFLICT);

    const createShow = await this.showRepository.create({
      ...showDTO,
      user: { id: showDTO.user_id },
    });
    const { id } = await this.showRepository.save(createShow);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('READ COMMITTED');

    try {
      if (A_SEATS > 0) {
        for (let i: number = maxSeat; i > maxSeat - A_SEATS; i--) {
          const seatDTO: RegistSeatDTO = {
            show_id: id,
            seat_number: i,
            grade: SeatCategory.AGRADE,
            price: A_PRICE,
          };
          await this.seatService.saveSeat(seatDTO, queryRunner.manager);
        }
      }
      maxSeat -= A_SEATS || 0;
      if (S_SEATS > 0) {
        for (let i = maxSeat; i > maxSeat - S_SEATS; i--) {
          const seatDTO: RegistSeatDTO = {
            show_id: id,
            seat_number: i,
            grade: SeatCategory.SUPERIOR,
            price: S_PRICE,
          };
          await this.seatService.saveSeat(seatDTO, queryRunner.manager);
        }
      }
      maxSeat -= S_SEATS || 0;
      if (R_SEATS > 0) {
        for (let i = maxSeat; i > maxSeat - R_SEATS; i--) {
          const seatDTO: RegistSeatDTO = {
            show_id: id,
            seat_number: i,
            grade: SeatCategory.ROYAL,
            price: R_PRICE,
          };
          await this.seatService.saveSeat(seatDTO, queryRunner.manager);
        }
      }
      maxSeat -= R_SEATS || 0;
      if (V_SEATS > 0) {
        for (let i = maxSeat; i > maxSeat - V_SEATS; i--) {
          const seatDTO: RegistSeatDTO = {
            show_id: id,
            seat_number: i,
            grade: SeatCategory.VIP,
            price: V_PRICE,
          };
          await this.seatService.saveSeat(seatDTO, queryRunner.manager);
        }
      }
      await queryRunner.commitTransaction();
    } catch (transactionError) {
      console.error(transactionError);
      await queryRunner.rollbackTransaction();
      await this.showRepository.delete(id);
      throw new HttpException('트랜잭션 에러 발생', HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      queryRunner.release();
    }
  }

  async getAllShows(): Promise<any> {
    const shows = await this.showRepository.find({ order: { created_at: 'DESC' } });
    return shows;
  }

  async getShow(showId: number): Promise<any> {
    const show = await this.showRepository.findOne({ where: { id: showId } });
    const availableReservation = await this.showRepository
      .createQueryBuilder('show')
      .innerJoin('show.seats', 'seat')
      .where('show.id = :showId and seat.reservation != true', { showId })
      .getOne();

    let available: Boolean;
    if (!availableReservation) available = false;
    else available = true;

    if (!show) throw new HttpException('해당하는 공연이 없습니다.', HttpStatus.NOT_FOUND);
    return { show, available };
  }

  async searchShow(search: keywordDTO): Promise<any> {
    const shows = await this.showRepository.find({
      where: { title: Like(`%${search.keyword}%`) },
      order: { created_at: 'DESC' },
    });
    return shows;
  }
}
