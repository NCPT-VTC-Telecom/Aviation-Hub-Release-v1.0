import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, PrimaryGeneratedColumn, OneToOne } from "typeorm";
import { AircraftVNA } from "./flight.entity";

@Entity("status")
export class StatusDescription {
  @PrimaryColumn()
  id: number;

  @Column()
  description: string;
}

@Entity("device_type")
export class DeviceTypeVNA {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  status_id: number;

  @ManyToOne(() => StatusDescription)
  @JoinColumn({ name: "status_id" })
  status_description: StatusDescription;
}

@Entity("devices")
export class DevicesVNA {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  type_id: number;

  @Column()
  aircraft_id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  date_of_manufacture: string;

  @Column()
  placement_location: string;

  @Column()
  activation_date: string;

  @Column()
  deactivation_date: string;

  @Column()
  status_id: number;

  @Column()
  deleted_date: Date;

  @Column()
  modified_date: Date;

  @ManyToOne(() => DeviceTypeVNA)
  @JoinColumn({ name: "type_id" })
  type: DeviceTypeVNA;

  @ManyToOne(() => StatusDescription)
  @JoinColumn({ name: "status_id" })
  status_description: StatusDescription;

  @OneToOne(() => AircraftVNA)
  @JoinColumn({ name: "aircraft_id" })
  aircraft: AircraftVNA;
}

@Entity("device_details")
export class DeviceDetailsVNA {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => DevicesVNA)
  @JoinColumn({ name: "device_id" })
  devices: DevicesVNA;

  @Column()
  device_id: string;

  @Column()
  ip_address: string;

  @Column()
  last_ip: string;

  @Column()
  port: string;

  @Column()
  mac_address: string;

  @Column()
  ipv6_address: string;

  @Column()
  firmware: string;

  @Column()
  wifi_standard: string;

  @Column()
  manufacturer: string;

  @Column()
  manufacturer_date: string;

  @Column()
  model: string;

  @Column()
  cpu_type: string;

  @Column()
  supplier: string;
}

@Entity("supplier")
export class SupplierVNA {
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
}

@Entity("device_health")
export class DeviceHealthVNA {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  device_id: string;

  @Column()
  check_time: Date;

  @Column()
  status: string;

  @Column()
  cpu_usage: number;

  @Column()
  memory_usage: number;

  @Column()
  disk_usage: number;

  @Column()
  temperature: number;

  @Column()
  modified_date: Date;
}
