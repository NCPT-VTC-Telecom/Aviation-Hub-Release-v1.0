import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, PrimaryColumn, OneToOne, OneToMany } from "typeorm";
import { StatusDescription } from "../../status/entity/status.entity";
import { Flights } from "src/management_portal/flights/entity/flights.entity";
import { Devices } from "src/management_portal/devices/entity/devices.entity";
import { UserInformation } from "src/management_portal/user/entity/user.entity";
import { Products } from "../../products/entity/product.entity";
import { Vouchers } from "src/management_portal/vouchers/entity/vouchers.entity";

@Entity("session_catalog")
export class SessionCatalog {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;
}

@Entity("sessions")
export class Sessions {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => UserInformation)
  @JoinColumn({ name: "user_id" })
  user: UserInformation;

  @ManyToOne(() => Flights)
  @JoinColumn({ name: "flight_id" })
  flight: Flights;

  @ManyToOne(() => Devices)
  @JoinColumn({ name: "device_id" })
  device: Devices;

  @ManyToOne(() => Products)
  @JoinColumn({ name: "product_id" })
  product: Products;

  @ManyToOne(() => Vouchers)
  @JoinColumn({ name: "voucher_id" })
  voucher?: Vouchers;

  @Column()
  user_id: string;

  @Column()
  flight_id: number;

  @Column()
  total_data_usage: number;

  @Column()
  total_data_upload: number;

  @Column()
  total_data_download: number;

  @Column()
  total_time_usage_hour: number;

  @Column()
  acct_session_id: string;

  @Column()
  acct_multisession_id: string;

  @Column()
  session_status: string;

  @Column()
  terminate_reason: string;

  @Column()
  user_mac_address: string;

  @Column()
  user_ip_address: string;

  @Column()
  user_device: string;

  @Column()
  modified_date: Date;

  @Column()
  created_date: Date;

  @Column()
  type_session: string;
}

@Entity("session_details")
export class SessionDetails {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Sessions)
  @JoinColumn({ name: "session_id" })
  session: Sessions;

  @ManyToOne(() => SessionCatalog)
  @JoinColumn({ name: "session_catalog_id" })
  session_catalog: SessionCatalog;

  @Column()
  session_id: string;

  @Column()
  start_time: Date;

  @Column()
  stop_time: Date;

  @Column()
  duration_time: number;

  @Column()
  user_ip_address: string;

  @Column()
  user_mac_address: string;

  @Column()
  data_usage_mb: number;

  @Column()
  average_speed_mbps: number;

  @Column()
  bytes_transferred: number;

  @Column()
  bytes_received: number;

  @Column()
  url: string;

  @Column()
  destination_ip: string;

  @Column()
  connection_quality: string;

  @Column()
  domain: string;

  @Column()
  port: string;

  @Column()
  user_agent: string;

  @Column()
  referrer: string;

  @Column()
  response_time_ms: number;

  @Column()
  ssl_version: string;

  @Column()
  protocol: string;

  @Column()
  status_id: number;

  @ManyToOne(() => StatusDescription)
  @JoinColumn({ name: "status_id" })
  status_description: StatusDescription;
}

@Entity("sessions")
export class FindSessions {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  user_id: string;

  @Column()
  flight_id: number;

  @Column()
  product_id: number;

  @Column({ type: "decimal", precision: 15, scale: 2 })
  total_data_usage: number;

  @Column({ type: "decimal", precision: 15, scale: 2 })
  total_data_upload: number;

  @Column({ type: "decimal", precision: 15, scale: 2 })
  total_data_download: number;

  @Column({ type: "decimal", precision: 15, scale: 2 })
  total_time_usage_hour: number;

  @Column()
  user_device: string;

  @Column()
  device_id: string;

  @Column()
  session_status: string;

  @Column()
  modified_date: Date;

  @Column()
  user_mac_address: string;

  @Column()
  user_ip_address: string;

  @Column()
  terminate_reason: string;
}

@Entity("session_details")
export class FindSessionDetails {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  session_id: string;

  @Column()
  session_catalog_id: number;

  @Column()
  start_time: Date;

  @Column()
  stop_time: Date;

  @Column()
  duration_time: number;

  @Column()
  user_ip_address: string;

  @Column()
  user_mac_address: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  data_usage_mb: number;

  @Column({ type: "float" })
  average_speed_mbps: number;

  @Column({ type: "float" })
  bytes_transferred: number;

  @Column({ type: "float" })
  bytes_received: number;

  @Column()
  url: string;

  @Column()
  destination_ip: string;

  @Column()
  connection_quality: string;

  @Column()
  domain: string;

  @Column()
  port: string;

  @Column()
  user_agent: string;

  @Column()
  referrer: string;

  @Column({ type: "float" })
  response_time_ms: number;

  @Column()
  ssl_version: string;

  @Column()
  protocol: string;

  @Column()
  status_id: number;

  @Column()
  modified_date: Date;
}

@Entity("user_activities")
export class UserSessionActivities {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserInformation)
  @JoinColumn({ name: "user_id" })
  user: UserInformation;

  @ManyToOne(() => Flights)
  @JoinColumn({ name: "flight_id" })
  flight: Flights;

  @ManyToOne(() => Devices)
  @JoinColumn({ name: "device_id" })
  device: Devices;

  @ManyToOne(() => FindSessions)
  @JoinColumn({ name: "session_id" })
  session: FindSessions;

  @Column()
  start_time: Date;

  @Column()
  end_time: Date;

  @Column()
  status_id: number;

  @Column()
  total_data_usage_mb: number;

  @Column()
  modified_date: Date;

  @Column()
  created_date: Date;
}
