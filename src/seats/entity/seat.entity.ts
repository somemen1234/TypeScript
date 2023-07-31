import { Reservation_Detail } from 'src/reservation_details/entity/reservation_detail.entity';
import { Show } from 'src/shows/entity/show.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SeatCategory } from '../seat-category.enum';

@Entity('seats')
export class Seat extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  seat_number: number;

  @Column()
  grade: SeatCategory;

  @Column()
  price: number;

  @Column({ default: false })
  reservation: Boolean;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;

  @OneToOne(() => Reservation_Detail)
  @JoinColumn()
  reservation_detail: Reservation_Detail;

  @ManyToOne(() => Show, (show) => show.seats)
  show: Show;
}
