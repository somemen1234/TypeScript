import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Show } from './entity/show.entity';
import { DataSource, Repository } from 'typeorm';
import { ShowDTO } from './dto/show.dto';
import { SeatInfoDTO } from 'src/seats/dto/seat.dto';
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
    let existShow = await this.showRepository.createQueryBuilder('shows').where('shows.user_id = :id', { id: showDTO.user_id });
    if (existShow) throw new HttpException('이미 존재하는 공연입니다.', HttpStatus.BAD_REQUEST);
    const { V_SEATS, R_SEATS, S_SEATS, A_SEATS } = seatInfoDTO;
    const maxSeat = 40;

    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { id } = await this.showRepository.save(showDTO);
      for (let i = 0; i < A_SEATS; i++, maxSeat - 1) {
        const seatDTO: any = {
          show_id: id,
          seat_number: maxSeat - i,
          grade: SeatCategory.AGRADE,
          price: seatInfoDTO.A_PRICE,
        };
        await this.seatService.saveSeat(seatDTO);
      }
      await queryRunner.commitTransaction;
    } catch (transactionError) {
      console.error(transactionError);
      await queryRunner.rollbackTransaction();
      throw new HttpException('트랜잭션 에러 발생', HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }
}
