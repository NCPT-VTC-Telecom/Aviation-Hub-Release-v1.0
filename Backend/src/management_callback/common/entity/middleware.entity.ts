import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("user_vendor")
export class VendorMiddleware {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  user_id: string;

  @Column()
  token: string;

  @Column()
  ip_addresses: string;

  @Column()
  expired_date: Date;

  @Column()
  status_id: number;
}
