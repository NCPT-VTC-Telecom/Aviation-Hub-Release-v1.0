import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("aircraft")
export class Aircraft {
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
  year_manufactured: string;

  @Column()
  ownership: string;

  @Column()
  status_id: number;

  @Column()
  modified_date: Date;

  @Column()
  created_date: Date;

  @Column()
  deleted_date: Date;
}

@Entity("maintenance_aircrafts")
export class AircraftMaintenance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  aircraft_id: number;

  @OneToOne(() => Aircraft, (aircraft) => aircraft.id)
  @JoinColumn({ name: "aircraft_id" })
  aircraft: Aircraft;

  @Column()
  maintenance_status: string;

  @Column()
  created_by: number;

  @Column()
  update_by: number;

  @Column()
  description: string;

  @Column()
  reason: string;

  @Column()
  from_date: Date;

  @Column()
  end_date: Date;

  @Column()
  status_id: number;

  @Column()
  maintenance_code: string;

  @Column()
  modified_date: Date;

  @Column()
  deleted_date: Date;

  @Column()
  created_date: Date;
}

@Entity("maintenance_aircrafts_hist")
export class MaintenanceAircraftHist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  maintenance_id: number;

  @Column()
  maintenance_status: string;

  @Column()
  from_date: Date;

  @Column()
  end_date: Date;

  @Column()
  status_id: number;

  @Column()
  modified_date: Date;

  @Column()
  created_date: Date;
}
