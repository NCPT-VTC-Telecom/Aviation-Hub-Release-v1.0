import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

//DataRole Chart
@Entity("group_role")
export class GroupRoleDataRoleChart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;
}

@Entity("users")
export class UserDataRoleChart {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @OneToMany(() => UserGroupDataRoleChart, (userGroup) => userGroup.user)
  user_groups: UserGroupDataRoleChart[];
}

@Entity("user_group")
export class UserGroupDataRoleChart {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => GroupRoleDataRoleChart)
  @JoinColumn({ name: "group_id" })
  group_role: GroupRoleDataRoleChart;

  @ManyToOne(() => UserDataRoleChart)
  @JoinColumn({ name: "user_id" })
  user: UserDataRoleChart;
}

@Entity("flights")
export class FlightDataRoleChart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  flight_number: string;

  @OneToMany(() => SessionDataRoleChart, (session) => session.flight)
  sessions: SessionDataRoleChart[];
}

@Entity("sessions")
export class SessionDataRoleChart {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => FlightDataRoleChart)
  @JoinColumn({ name: "flight_id" })
  flight: FlightDataRoleChart;

  @ManyToOne(() => UserDataRoleChart)
  @JoinColumn({ name: "user_id" })
  user: UserDataRoleChart;

  @Column("decimal", { precision: 10, scale: 2 })
  total_data_usage: number;

  @Column()
  created_date: Date;
}
