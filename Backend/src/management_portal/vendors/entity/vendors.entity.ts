import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { UserGroup, UserGroupLevel2, UserGroupLevel3 } from "src/management_portal/user_group/entity/user_group.entity";
import { UserInformation } from "src/management_portal/user/entity/user.entity";

@Entity("users") // Renamed to avoid reserved keyword conflict
export class VendorUserInformation {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  fullname: string;

  @Column()
  email: string;

  @Column()
  phone_number: string;

  @Column()
  address: string;

  @Column()
  ward: string;

  @Column()
  district: string;

  @Column()
  province: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  status_id: number;

  @Column({ nullable: true }) // Handle nullable dates
  deleted_date: Date;

  @Column({ nullable: true })
  modified_date: Date;
}

@Entity("user_vendor")
export class VendorInformation {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  user_id: string;

  @Column()
  description: string;

  @Column()
  token: string;

  @Column()
  expired_date: Date;

  @Column()
  status_id: number;

  @Column()
  ip_addresses: string;

  @Column()
  modified_date: Date;

  @Column()
  deleted_date: Date;

  @Column()
  created_date: Date;

  @OneToOne(() => UserInformation)
  @JoinColumn({ name: "user_id" }) // Join column to link the foreign key
  user_information: UserInformation;

  @OneToMany(() => UserGroup, (userGroup) => userGroup.vendor)
  user_group: UserGroup[];

  @OneToMany(() => UserGroupLevel2, (userGroupLv2) => userGroupLv2.vendor)
  user_group_lv2: UserGroupLevel2[];

  @OneToMany(() => UserGroupLevel3, (userGroupLv3) => userGroupLv3.vendor)
  user_group_lv3: UserGroupLevel3[];
}

@Entity("user_vendor")
export class VendorRenewInformation {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  user_id: string;

  @Column()
  token: string;

  @Column()
  expired_date: Date;

  @Column()
  status_id: number;

  @Column()
  modified_date: Date;
}
