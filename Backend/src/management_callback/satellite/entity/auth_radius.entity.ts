import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "users" }) // Specify the name of the table if different from the entity name
export class AuthRadiusLogin {
  [x: string]: any;
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  status_id: number;
}

@Entity({ name: "api_radius_request" })
export class ApiRadiusAuthRequest {
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
export class RadiusUserActivities {
  [x: string]: any;
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
