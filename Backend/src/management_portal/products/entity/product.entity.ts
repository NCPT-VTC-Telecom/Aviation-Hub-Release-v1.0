import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { StatusDescription } from "../../status/entity/status.entity";

@Entity("product_price")
export class ProductPrice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product_id: number;

  @Column()
  original_price: number;

  @Column()
  new_price: number;

  @Column()
  currency: string;

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;

  @Column()
  created_by: number;

  @Column()
  status_id: number;

  @ManyToOne(() => StatusDescription)
  @JoinColumn({ name: "status_id" })
  status: StatusDescription;

  @Column({ type: "datetime", nullable: true })
  deleted_date: Date;

  @Column({ type: "datetime" })
  modified_date: Date;

  @Column({ type: "datetime" })
  created_date: Date;
}
@Entity("products")
export class Products {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price_id: number;

  @ManyToOne(() => ProductPrice)
  @JoinColumn({ name: "price_id" })
  price: ProductPrice;

  @Column()
  image_link: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  type: string;

  @Column()
  total_time: number;

  @Column()
  bandwidth_upload: number;

  @Column()
  bandwidth_download: number;

  @Column()
  data_total: number;

  @Column()
  data_upload: number;

  @Column()
  data_download: number;

  @Column()
  status_id: number;

  @ManyToOne(() => StatusDescription)
  @JoinColumn({ name: "status_id" })
  status: StatusDescription;

  @Column({ type: "datetime", nullable: true })
  deleted_date: Date;

  @Column({ type: "datetime" })
  modified_date: Date;

  @Column({ type: "datetime" })
  created_date: Date;
}

@Entity("products_plane_ticket")
export class ProductPlaneTicket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  sku: string;

  @Column()
  ticket_plan: string;

  @Column()
  product_id: number;

  @OneToOne(() => Products)
  @JoinColumn({ name: "product_id" })
  product: Products;

  @Column()
  description: string;

  @Column()
  status_id: number;

  @Column()
  created_date: Date;

  @Column()
  deleted_date: Date;

  @Column()
  modified_date: Date;
}

@Entity("products_telecom")
export class ProductTelecom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  sku: string;

  @Column()
  ticket_plan: string;

  @Column()
  product_id: number;

  @Column()
  product_type: string;

  @Column()
  description: string;

  @Column()
  status_id: number;

  @Column()
  created_date: Date;

  @Column()
  deleted_date: Date;

  @Column()
  modified_date: Date;
}
