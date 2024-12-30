import { Entity, Column, JoinColumn, PrimaryGeneratedColumn, OneToOne } from "typeorm";

//Device Health Chart

@Entity("devices")
export class DevicesDataHealthChart {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  status_id: number;
}
@Entity("device_health")
export class DeviceHealthChart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: string;

  @OneToOne(() => DevicesDataHealthChart)
  @JoinColumn({ name: "device_id" })
  devices: DevicesDataHealthChart;
}
