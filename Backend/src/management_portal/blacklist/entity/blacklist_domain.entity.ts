import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BlackListCategoriesInfo } from './blacklist_categories.entity';

@Entity("blacklist_domains")
export class BlackListDomainInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  url: string;

  @Column()
  ip_address: string;

  @Column()
  ipv6_address: string;

  @Column()
  dns_address: string;

  @Column()
  reason: string;

  @Column()
  category_id: number;

  @OneToOne(() => BlackListCategoriesInfo)
  @JoinColumn({ name: "category_id" })
  category: BlackListCategoriesInfo;

  @Column()
  status_id: number;

  @Column()
  deleted_date: Date;

  @Column()
  modified_date: Date;

  @Column()
  created_date: Date;
}
