import { Reservation } from 'src/reservations/entity/reservation.entity';
import { Seat } from 'src/seats/entity/seat.entity';
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

@Entity('reservation_details')
export class Reservation_Detail extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

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

  @OneToOne(() => Seat, (seat) => seat.reservation)
  @JoinColumn()
  seat: Seat;

  @ManyToOne(() => Reservation, (reservation) => reservation.reservation_details)
  reservation: Reservation;
}
