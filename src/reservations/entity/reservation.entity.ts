import { Reservation_Detail } from 'src/reservation_details/entity/reservation_detail.entity';
import { Show } from 'src/shows/entity/show.entity';
import { User } from 'src/users/entity/user.entity';
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

@Entity('reservations')
export class Reservation extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  total_price: number;

  @Column({ default: true })
  reservation_status: Boolean;

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

  @ManyToOne(() => User, (user) => user.reservations)
  user: User;

  @ManyToOne(() => Show, (show) => show.reservations)
  show: Show;

  @OneToMany(() => Reservation_Detail, (reservation_detail) => reservation_detail.reservation, { cascade: true })
  reservation_details: Reservation_Detail[];
}
