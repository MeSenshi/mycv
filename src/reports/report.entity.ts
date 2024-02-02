import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { UserEntity } from "../users/user.entity";

@Entity()
export class ReportEntity {  //preform as repository
  @PrimaryGeneratedColumn()
  id: number;

  @Column({default: false})
  approved: boolean

  @ManyToOne(()=> UserEntity, (user)=> user.reports)
  user: UserEntity;

  @Column()
  price: number;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column()
  lng: number;

  @Column()
  lat: number;

  @Column()
  mileage: number;
}