import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Passport from './passport.entity';

@Entity('users')
export default class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToOne(() => Passport, { cascade: true })
  @JoinColumn()
  passport: Passport;
}
