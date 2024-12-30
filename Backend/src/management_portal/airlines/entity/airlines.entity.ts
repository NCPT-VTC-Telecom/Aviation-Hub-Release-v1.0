import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("airlines")
export class AirlinesInfo {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  code: string;

  @Column()
  token_code: string;

  @Column()
  country: string;

  @Column()
  email: string;

  @Column()
  phone_number: string;

  @Column()
  status_id: number;

  @Column()
  created_date: Date;

  @Column()
  modified_date: Date;

  @Column()
  deleted_date: Date;
}
