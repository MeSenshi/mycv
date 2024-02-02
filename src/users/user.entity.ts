import { AfterInsert, AfterRemove, AfterUpdate, Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { ReportEntity } from "../reports/report.entity";


@Entity()
export class UserEntity { //preform as repository
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  admin: boolean;

  @OneToMany(() => ReportEntity, (report) => report.user)
  reports: ReportEntity[];

  @AfterInsert()
  logInsert() {
    console.log("inserted user with id", this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log("updated user with id", this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log("removed user with id", this.id);
  }
}