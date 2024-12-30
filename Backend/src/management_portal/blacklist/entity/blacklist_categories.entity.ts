import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("blacklist_categories")
export class BlackListCategoriesInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column()
  description: string;

  @Column()
  status_id: number;

  @Column()
  deleted_date: Date;

  @Column()
  modified_date: Date;

  @Column()
  created_date: Date;
}
