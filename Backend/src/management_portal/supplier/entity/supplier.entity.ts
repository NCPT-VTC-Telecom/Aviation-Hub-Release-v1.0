import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("supplier")
export class Supplier {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  address: string;

  @Column()
  contact: string;

  @Column()
  type: string;

  @Column()
  status_id: number;

  @Column()
  modified_date: Date;

  @Column()
  deleted_date: Date;

  @Column()
  created_date: Date;
}
