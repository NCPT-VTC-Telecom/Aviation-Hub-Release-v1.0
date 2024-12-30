import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "users" }) // Specify the name of the table if different from the entity name
export class SatelliteUserLogin {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  status_id: number;
}

@Entity({ name: "user_acct_temp" })
export class PreSatelliteUserLogin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  client_mac: string;

  @Column()
  sip: string;

  @Column()
  timestamp: Date;

  @Column()
  device_id: string;

  @Column()
  flight_id: number;

  @Column()
  login_status: string;

  @Column()
  product_id: number;
}

@Entity("session_catalog")
export class SatelliteSessionCatalog {
  [x: string]: any;
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;
}

@Entity("sessions")
export class SatelliteSessions {
  // [x: string]: any;
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  user_id: string;

  @Column()
  voucher_id: string;

  @Column()
  flight_id: number;

  @Column()
  product_id: number;

  @Column()
  total_data_usage: number;

  @Column()
  total_data_pending: number;

  @Column()
  total_data_upload: number;

  @Column()
  total_data_download: number;

  @Column()
  total_time_usage_hour: number;

  @Column()
  user_device: string;

  @Column()
  device_id: string;

  @Column()
  session_status: string;

  @Column()
  acct_session_id: string;

  @Column()
  acct_authentic: string;

  @Column()
  acct_multisession_id: string;

  @Column()
  terminate_reason: string;

  @Column()
  user_mac_address: string;

  @Column()
  user_ip_address: string;

  @Column()
  modified_date: Date;

  @Column()
  type_session: string;
}

@Entity("session_details")
export class SatelliteSessionDetails {
  [x: string]: any;
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

  @Column()
  modified_date: Date;
}

@Entity("device_details")
export class SatelliteDeviceDetails {
  [x: string]: any;
  @PrimaryGeneratedColumn()
  id: string;

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
  wifi_standard: string;
}

@Entity("devices")
export class SatelliteDevices {
  [x: string]: any;
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  type_id: number;

  @Column()
  aircraft_id: number;

  @Column()
  status_id: number;

  @Column()
  deleted_date: Date;

  @Column()
  modified_date: Date;
}

@Entity("flights")
export class SatelliteFlights {
  [x: string]: any;
  @PrimaryColumn()
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
}

@Entity({ name: "users" })
export class SatelliteRadiusUser {
  [x: string]: any;
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  username: string;

  @Column()
  status_id: number;
}

@Entity("orders")
export class SatelliteOrderInformation {
  [x: string]: any;
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  user_id: string;

  @Column()
  flight_id: number;

  @Column()
  status_id: number;

  @Column()
  payment_status_id: number;

  @Column()
  fulfillment_status_id: number;

  @Column()
  modified_date: Date;

  @Column()
  created_date: Date;
}

@Entity("order_details")
export class SatelliteOrderDetails {
  [x: string]: any;
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  order_id: string;

  @Column()
  product_id: number;

  @Column()
  quantity: number;

  @Column()
  modified_date: Date;
}

@Entity("products")
export class SatelliteProducts {
  [x: string]: any;
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  total_time: number;

  @Column()
  bandwidth_upload: number;

  @Column()
  bandwidth_download: number;

  @Column()
  data_total: number;

  @Column()
  data_upload: number;

  @Column()
  data_download: number;

  @Column()
  status_id: number;
}

@Entity({ name: "api_radius_request" })
export class ApiSatelliteAAARequest {
  [x: string]: any;
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  request_body: string;

  @Column()
  request_headers: string;

  @Column()
  request_url: string;

  @Column()
  response_message: string;

  @Column()
  response_reason: string;

  @Column()
  request_ip_address: string;
}

@Entity({ name: "user_activities" })
export class ApiSatelliteActivities {
  // [x: string]: any;
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: string;

  @Column()
  session_id: string;

  @Column()
  device_id: string;

  @Column()
  flight_id: number;

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
}

@Entity("user_acct_temp")
export class UserAcctTemp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  client_mac: string;

  @Column()
  sip: string;

  @Column()
  flight_id: number;

  @Column()
  device_id: string;

  @Column()
  product_id: number;

  @Column()
  timestamp: Date;

  @Column()
  created_date: Date;
}

@Entity("vouchers")
export class AuthenticateVoucher {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  voucher_code: string;

  @Column()
  from_date: Date;

  @Column()
  end_date: Date;

  @Column()
  status_id: number;
}

@Entity("blacklist_domains")
export class SatelliteBlacklistDomains {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  url: string;

  @Column()
  ip_address: string;

  @Column()
  ipv6_address: string;

  @Column()
  dns_address: string;

  @Column()
  reason: string;
}
