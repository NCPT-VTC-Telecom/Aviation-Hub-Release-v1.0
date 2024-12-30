import { StatusDescription } from "src/management_portal/status/entity/status.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Aircraft } from "./aircraft.entity";

@Entity("flights")
export class Flights {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  departure_airport: string;

  @Column()
  arrival_airport: string;

  @Column()
  departure_time: Date;

  @Column()
  arrival_time: Date;

  @Column()
  flight_phase: string;

  @Column()
  airline: string;

  @ManyToOne(() => Aircraft)
  @JoinColumn({ name: "aircraft_id" })
  aircraft: Aircraft;

  @ManyToOne(() => StatusDescription)
  @JoinColumn({ name: "status_id" })
  status_description: StatusDescription;

  @Column()
  aircraft_id: number;

  @Column()
  status_id: number;

  @Column()
  lat_location: string;

  @Column()
  long_location: string;

  @Column()
  altitude: string;

  @Column()
  created_date: Date
}
