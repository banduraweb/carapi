import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  price: number;
  @Column()
  model: string;
  @Column()
  year: number;
  @Column()
  lon: number;
  @Column()
  lat: number;
  @Column()
  mileage: number;
  @Column()
  make: string;
  @ManyToOne(() => User, (user) => user.reports)
  user: User;
}
