import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  TableForeignKey,
  JoinColumn,
} from 'typeorm';
import { Report } from '../reports/report.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;
  @Column()
  password: string;
  @OneToMany(() => Report, (report) => report.user)
  // @JoinColumn()
  reports: Report[];
  @AfterInsert()
  logInsert() {
    console.log('Insert new user', this.id);
  }
  @AfterRemove()
  logRemove() {
    console.log('Deleted user', this.id);
  }
  @AfterUpdate()
  logUpdate() {
    console.log('Deleted user', this.id);
  }
}
