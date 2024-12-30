import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from "typeorm";
import { UserInformation, UserVerifyInformation } from "src/management_portal/user/entity/user.entity";
import { VendorInformation } from "src/management_portal/vendors/entity/vendors.entity";

@Entity("user_group")
export class UserGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  group_id: number;

  @Column()
  user_id: string;

  @ManyToOne(() => VendorInformation, (vendor) => vendor.user_group)
  @JoinColumn({ name: "user_id", referencedColumnName: "user_id" })
  vendor: VendorInformation;

  @ManyToOne(() => UserInformation, (user) => user.user_group)
  @JoinColumn({ name: "user_id" })
  user: UserInformation;

  @ManyToOne(() => UserInformation, (user) => user.user_group)
  @JoinColumn({ name: "user_id" })
  user_verify: UserInformation;
}

@Entity("user_group_lv2")
export class UserGroupLevel2 {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  group_id_lv1: number;

  @Column()
  group_id_lv2: number;

  @Column()
  user_id: string;

  @ManyToOne(() => VendorInformation, (vendor) => vendor.user_group_lv2)
  @JoinColumn({ name: "user_id", referencedColumnName: "user_id" })
  vendor: VendorInformation;

  @ManyToOne(() => UserInformation, (user) => user.user_group_lv2)
  @JoinColumn({ name: "user_id" })
  user: UserInformation;

  @ManyToOne(() => UserVerifyInformation, (user) => user.user_group_lv2)
  @JoinColumn({ name: "user_id" })
  user_verify: UserVerifyInformation;
}

@Entity("user_group_lv3")
export class UserGroupLevel3 {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  group_id_lv1: number;

  @Column()
  group_id_lv2: number;

  @Column()
  group_id_lv3: number;

  @Column()
  user_id: string;

  @ManyToOne(() => VendorInformation, (vendor) => vendor.user_group_lv3)
  @JoinColumn({ name: "user_id", referencedColumnName: "user_id" })
  vendor: VendorInformation;

  @ManyToOne(() => UserInformation, (user) => user.user_group_lv3)
  @JoinColumn({ name: "user_id" })
  user: UserInformation;

  @ManyToOne(() => UserVerifyInformation, (user) => user.user_group_lv3)
  @JoinColumn({ name: "user_id" })
  user_verify: UserVerifyInformation;
}

@Entity("group_role")
export class GroupRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  permission: string;

  @Column()
  level: number;

  @Column()
  access: string;

  @Column()
  status_id: number;

  @Column()
  parent_id: number;

  @Column()
  deleted_date: Date;

  @Column()
  modified_date: Date;

  @Column()
  created_date: Date;
}
