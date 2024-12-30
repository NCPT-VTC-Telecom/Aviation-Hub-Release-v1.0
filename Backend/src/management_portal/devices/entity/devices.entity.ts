import { Aircraft } from "src/management_portal/flights/entity/aircraft.entity";
import { StatusDescription } from "src/management_portal/status/entity/status.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("device_type")
export class DeviceType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  status_id: number;

  @Column()
  created_date: Date;

  @ManyToOne(() => StatusDescription)
  @JoinColumn({ name: "status_id" })
  status_description: StatusDescription;
}

@Entity("devices")
export class Devices {
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

  @Column()
  created_date: Date;

  @ManyToOne(() => StatusDescription)
  @JoinColumn({ name: "status_id" })
  status_description: StatusDescription;

  @ManyToOne(() => DeviceType)
  @JoinColumn({ name: "type_id" })
  type: DeviceType;

  @OneToOne(() => Aircraft)
  @JoinColumn({ name: "aircraft_id" })
  aircraft: Aircraft;
}

@Entity("device_details")
export class DeviceDetails {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => Devices)
  @JoinColumn({ name: "device_id" })
  devices: Devices;

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

  @Column()
  created_date: Date;
}

@Entity("devices")
export class DeviceInfo {
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

  @ManyToOne(() => StatusDescription)
  @JoinColumn({ name: "status_id" })
  status_description: StatusDescription;

  @ManyToOne(() => DeviceType)
  @JoinColumn({ name: "type_id" })
  type: DeviceType;

  @OneToOne(() => DeviceDetails, (deviceDetail) => deviceDetail.devices)
  details: DeviceDetails;
}

@Entity("device_health")
export class DeviceHealth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  device_id: string;

  @OneToOne(() => DeviceInfo, (devices) => devices.details)
  @JoinColumn({ name: "device_id" })
  devices: DeviceInfo;

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

  @Column()
  created_date: Date;
}

@Entity("device_health_activities")
export class DeviceHealthActivities {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  device_id: string;

  @OneToOne(() => DeviceInfo, (devices) => devices.details)
  @JoinColumn({ name: "device_id" })
  devices: DeviceInfo;

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

  @Column()
  created_date: Date;
}

@Entity("devices_health_tracking")
export class DeviceTrackingHealth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  device_id: string;

  @Column()
  ping_rate_success: number;

  @Column()
  packet_loss_rate: number;

  @Column()
  check_time: Date;

  @Column()
  created_date: Date;
}

@Entity("maintenance_devices")
export class MaintenanceDevices {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  device_id: string;

  @OneToOne(() => DeviceInfo, (devices) => devices.details)
  @JoinColumn({ name: "device_id" })
  devices: DeviceInfo;

  @Column()
  maintenance_status: string;

  @Column()
  maintenance_code: string;

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
  deleted_date: Date;

  @Column()
  modified_date: Date;

  @Column()
  created_date: Date;
}

@Entity("maintenance_devices_hist")
export class MaintenanceDevicesHist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  maintenance_id: number;

  @OneToOne(() => MaintenanceDevices, (maintenance) => maintenance.id)
  @JoinColumn({ name: "maintenance_id" })
  maintenance_info: MaintenanceDevices;

  @Column()
  maintenance_status: string;

  @Column()
  from_date: Date;

  @Column()
  end_date: Date;

  @Column()
  status_id: number;

  @Column()
  deleted_date: Date;

  @Column()
  modified_date: Date;

  @Column()
  created_date: Date;
}

@Entity("IFC_service_metrics")
export class IFCServiceMetrics {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  device_id: string;

  @Column()
  flight_id: number;

  @Column()
  speed: number;

  @Column()
  latency: number;

  @Column()
  bandwidth_usage: number;

  @Column()
  packet_loss_rate: number;

  @Column()
  connection_quality: number;

  @Column()
  uptime: number;

  @Column()
  downtime: number;

  @Column()
  unauthorized_access_attempts: number;

  @Column()
  failed_connections: number;

  @Column()
  concurrent_users: number;

  @Column()
  created_date: Date;
}
