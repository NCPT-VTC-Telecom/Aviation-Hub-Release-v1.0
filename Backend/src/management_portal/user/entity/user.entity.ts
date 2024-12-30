import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { UserGroup, UserGroupLevel2, UserGroupLevel3 } from "src/management_portal/user_group/entity/user_group.entity";

@Entity("users")
export class UserVerifyInformation {
  @PrimaryColumn()
  id: string;

  @Column()
  fullname: string;

  @Column()
  email: string;

  @Column()
  phone_number: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  status_id: number;

  @OneToMany(() => UserGroup, (userGroup) => userGroup.user_verify)
  user_group: UserGroup[];

  @OneToMany(() => UserGroupLevel2, (userGroupLv2) => userGroupLv2.user_verify)
  user_group_lv2: UserGroupLevel2[];

  @OneToMany(() => UserGroupLevel3, (userGroupLv3) => userGroupLv3.user_verify)
  user_group_lv3: UserGroupLevel3[];
}

@Entity({ name: "users" }) // Specify the name of the table if different from the entity name
export class AuthManagementLogin {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "nvarchar", length: 500 })
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  status_id: number;
}

@Entity("users")
export class UserInformation {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  fullname: string;

  @Column()
  email: string;

  @Column()
  phone_number: string;

  @Column()
  gender: string;

  @Column()
  citizen_id: string;

  @Column()
  address: string;

  @Column()
  ward: string;

  @Column()
  district: string;

  @Column()
  province: string;

  @Column()
  country: string;

  @Column()
  postcode: string;

  @Column()
  username: string;

  @Column()
  status_id: number;

  @Column()
  modified_date: Date;

  @Column()
  deleted_date: Date;

  @Column()
  created_date: Date;

  @OneToMany(() => UserGroup, (userGroup) => userGroup.user)
  user_group: UserGroup[];

  @OneToMany(() => UserGroupLevel2, (userGroupLv2) => userGroupLv2.user)
  user_group_lv2: UserGroupLevel2[];

  @OneToMany(() => UserGroupLevel3, (userGroupLv3) => userGroupLv3.user)
  user_group_lv3: UserGroupLevel3[];
}

@Entity("users")
export class AddUserInformation {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  fullname: string;

  @Column()
  email: string;

  @Column()
  phone_number: string;

  @Column()
  gender: string;

  @Column()
  citizen_id: string;

  @Column()
  address: string;

  @Column()
  ward: string;

  @Column()
  district: string;

  @Column()
  province: string;

  @Column()
  country: string;

  @Column()
  postcode: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  status_id: number;

  @Column()
  modified_date: Date;
}

@Entity("users")
export class ChangePasswordInformation {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  modified_date: Date;
}
