import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, OneToMany } from "typeorm";

//number_purchases_plan Chart
@Entity("products")
export class ProductPurchaseChart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;
}

@Entity("orders")
export class OrdersPurchaseChart {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToMany(() => OrderDetailPurchaseChart, (orderDetails) => orderDetails.order)
  order_details: OrderDetailPurchaseChart[];

  @Column()
  created_date: Date;
}

@Entity("order_details")
export class OrderDetailPurchaseChart {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => OrdersPurchaseChart, (order) => order.order_details)
  @JoinColumn({ name: "order_id" })
  order: OrdersPurchaseChart;

  @ManyToOne(() => ProductPurchaseChart)
  @JoinColumn({ name: "product_id" })
  product: ProductPurchaseChart;

  @Column()
  quantity: number;
}

//number_purchases_plan_date Chart
@Entity("products")
export class ProductProductDateChart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;
}

@Entity("orders")
export class OrderProductDateChart {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToMany(() => OrderDetailPurchaseChart, (orderDetails) => orderDetails.order)
  order_details: OrderDetailPurchaseChart[];

  @Column()
  created_date: Date;
}

@Entity("order_details")
export class OrderDetailProductDateChart {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => OrderProductDateChart, (order) => order.order_details)
  @JoinColumn({ name: "order_id" })
  order: OrderProductDateChart;

  @ManyToOne(() => ProductProductDateChart)
  @JoinColumn({ name: "product_id" })
  product: ProductProductDateChart;

  @Column()
  quantity: number;
}

//number_purchases_sale_channel Chart

@Entity("sale_channels")
export class SaleChannelChart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;
}

@Entity("orders")
export class OrderPurchaseSaleChannelsChart {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => SaleChannelChart)
  @JoinColumn({ name: "sale_channels_id" })
  sale_channel: SaleChannelChart;

  @Column()
  created_date: Date;
}
