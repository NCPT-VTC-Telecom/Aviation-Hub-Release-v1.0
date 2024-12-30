import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("sale_channels")
export class SaleChannels {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  value: string;

  @Column()
  status_id: number;

  @Column()
  modified_date: Date;

  @Column()
  deleted_date: Date;

  @Column()
  created_date: Date;
}
