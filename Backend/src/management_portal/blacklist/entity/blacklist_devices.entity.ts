import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("blacklist_devices")
export class BlackListDevicesInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  device_name: string;

  @Column()
  ip_address: string;

  @Column()
  ipv6_address: string;

  @Column()
  mac_address: string;

  @Column()
  reason: string;

  @Column()
  status_id: number;

  @Column()
  deleted_date: Date;

  @Column()
  modified_date: Date;

  @Column()
  created_date: Date;
}
