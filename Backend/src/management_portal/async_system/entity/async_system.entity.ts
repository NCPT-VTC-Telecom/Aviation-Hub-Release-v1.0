import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("vouchers")
export class CheckVoucherExpire {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  end_date: Date;

  @Column()
  status_id: number;

  @Column()
  modified_date: Date;
}
