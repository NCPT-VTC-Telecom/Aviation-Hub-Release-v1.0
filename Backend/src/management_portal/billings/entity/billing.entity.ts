import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("billings")
export class BillingData {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  billing_number: string;

  @Column()
  total_quantity: number;

  @Column()
  total: number;

  @Column()
  billing_date: Date;

  @Column()
  status_id: number;

  @Column()
  modified_date: Date;

  @Column()
  created_date: Date;
}
