import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("flights")
export class FlightsVietnamAirline {
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
  modified_date: Date;

  @Column()
  created_date: Date;
}

@Entity("aircraft")
export class AircraftVNA {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  flight_number: string;

  @Column()
  tail_number: string;

  @Column()
  model: string;

  @Column()
  manufacturer: string;

  @Column()
  model_type: string;

  @Column()
  capacity: number;

  @Column()
  leased_aircraft_status: string;

  @Column()
  year_manufactured: Date;

  @Column()
  ownership: string;

  @Column()
  status_id: number;

  @Column()
  modified_date: Date;
}
