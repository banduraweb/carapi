import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;
  @Column()
  @Exclude()
  password: string;
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
