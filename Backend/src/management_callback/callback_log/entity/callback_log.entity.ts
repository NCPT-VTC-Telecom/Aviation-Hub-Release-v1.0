import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("api_callback_request")
export class CallBackLogRequestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  request_url: string;

  @Column()
  request_method: string;

  @Column()
  request_data: string;

  @Column()
  request_time_UTC?: Date;

  @Column()
  request_content_type: string;

  @Column()
  request_ip_address: string;

  @Column()
  request_user_agent: string;

  @Column()
  response_status_code: string;

  @Column()
  response_content: string;

  @Column()
  response_time_UTC?: Date;

  @Column()
  response_ip_address: string;
}
