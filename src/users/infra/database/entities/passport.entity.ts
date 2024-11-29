import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('passports')
export default class PassportEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  number: string;

  @Column()
  country: string;
}
