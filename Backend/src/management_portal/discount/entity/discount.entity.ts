import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("discount")
export class Discount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  quantity: number;

  @Column()
  quantity_per_user: number;

  @Column()
  date_from: Date;

  @Column()
  date_end: Date;

  @Column()
  minimal: number;

  @Column()
  maximal: number;

  @Column()
  deleted_date: Date;

  @Column()
  modified_date: Date;

  @Column()
  created_date: Date;

  @Column()
  code: string;

  @Column()
  type: string;

  @Column()
  status_id: number;
}
