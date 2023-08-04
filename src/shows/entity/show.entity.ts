import { Seat } from 'src/seats/entity/seat.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entity/user.entity';
import { ShowCategory } from '../show-category.enum';
import { Reservation } from 'src/reservations/entity/reservation.entity';

@Entity('shows')
export class Show extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  show_poster: string;

  @Column()
  show_time: Date;

  @Column()
  show_category: ShowCategory;

  @Column()
  max_seat: number;

  @Column()
  location: string;

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

  @OneToMany(() => Seat, (seat) => seat.show, { cascade: true })
  seats: Seat[];

  @OneToMany(() => Reservation, (reservation) => reservation.show)
  reservations: Reservation[];

  @ManyToOne(() => User, (user) => user.shows)
  user: User;
}
