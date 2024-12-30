import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserInformation } from "src/management_portal/user/entity/user.entity";

@Entity("customer_service_request")
export class CustomerService {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  request_number: string;

  @Column()
  title_sender: string;

  @Column()
  body_sender: string;

  @Column("uuid")
  user_sender_id: string;

  @Column()
  body_receiver: string;

  @Column("uuid")
  user_receiver_id: string;

  @Column()
  status_id: number;

  @Column()
  label: string;

  @Column()
  modified_date: Date;

  @Column()
  created_date: Date;

  @ManyToOne(() => UserInformation, { eager: true })
  @JoinColumn({ name: "user_sender_id" })
  user_sender: UserInformation;
}
