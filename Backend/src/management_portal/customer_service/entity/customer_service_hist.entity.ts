import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("customer_service_request_hist")
export class CustomerServiceHist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  request_id: number;

  @Column()
  title_sender: string;

  @Column()
  body_sender: string;

  @Column()
  body_receiver: string;

  @Column()
  status_id: number;

  @Column()
  error_description: string;

  @Column()
  label: string;

  @Column()
  created_date: Date;
}
