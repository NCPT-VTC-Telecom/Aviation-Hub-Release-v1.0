import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("ticket_vna")
export class TicketVietnamAirline {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  serial: string;

  @Column("uuid")
  user_id: string;

  @Column()
  flight_id: number;

  @Column()
  status_id: number;

  @Column()
  deleted_date: Date;

  @Column()
  modified_date: Date;

  @Column()
  created_date: Date;
}
