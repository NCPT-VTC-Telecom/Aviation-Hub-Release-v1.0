import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("vouchers")
export class VoucherInformation {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  voucher_code: string;

  @Column()
  created_by: number;

  @Column()
  from_date: Date;

  @Column()
  end_date: Date;

  @Column()
  type: string;

  @Column()
  user_id: string;

  @Column()
  product_id: number;

  @Column()
  status_id: number;

  @Column()
  created_date: Date;

  @Column()
  modified_date: Date;

  @Column()
  deleted_date: Date;

  @Column()
  request_id: string;
}

@Entity("products")
export class ProductVoucher {
  @PrimaryColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

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
}

@Entity("status")
export class StatusInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  description: string;

  @Column()
  type: string;
}
