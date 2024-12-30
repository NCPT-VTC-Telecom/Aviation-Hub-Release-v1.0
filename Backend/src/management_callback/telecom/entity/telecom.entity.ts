import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("telecom_redeem")
export class TelecomRedeem {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  phone_number: string;

  @Column()
  user_id: string;

  @Column()
  product_id: number;

  @Column()
  flight_id: number;

  @Column()
  status_id: number;
}

@Entity("users")
export class UserVerifyInformation {
  @PrimaryColumn()
  id: string;

  @Column()
  phone_number: string;

  @Column()
  username: string;

  @Column()
  status_id: number;
}
