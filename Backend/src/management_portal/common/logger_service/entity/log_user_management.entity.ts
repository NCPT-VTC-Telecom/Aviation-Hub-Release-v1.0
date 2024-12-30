// src/entity/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("user_login_hist")
export class LogUserActivities {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: string;

  @Column()
  access_token: string;

  @Column()
  type: string;

  @Column()
  login_count: number;

  @Column()
  last_time: Date;

  @Column()
  access_time: Date;

  @Column()
  ipaddress: string;

  @Column()
  user_agent: string;

  @Column()
  modified_date: Date;
}

@Entity("audit_log")
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: string;

  @Column()
  action_type: string;

  @Column()
  table_name: string;

  @Column()
  request_content: string;

  @Column()
  action_time: Date;

  @Column()
  old_data: string;

  @Column()
  new_data: string;

  @Column()
  ipaddress: string;

  @Column()
  user_agent: string;

  @Column()
  response_content: string;

  @Column()
  created_date: Date;
}
