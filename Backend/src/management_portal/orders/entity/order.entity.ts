import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { Flights } from "src/management_portal/flights/entity/flights.entity";
import { Gateways } from "src/management_portal/gateways/entity/gateway.entity";
import { Products } from "../../products/entity/product.entity";
import { UserInformation } from "src/management_portal/user/entity/user.entity";
import { SaleChannels } from "src/management_portal/sale_channels/entity/sale_channels.entity";

@Entity("billings")
export class Billings {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  billing_number: string;

  @Column()
  total_quantity: number;

  @Column()
  total: number;

  @Column()
  status_id: number;

  @Column()
  billing_date: Date;

  @Column()
  modified_date: Date;

  @Column()
  created_date: Date;

  @OneToOne(() => Orders, (orders) => orders.billing)
  orders: Relation<Orders>;
}
@Entity("transactions")
export class Transactions {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  subtotal: number;

  @Column()
  total: number;

  @Column()
  status_id: number;

  @Column()
  transaction_date: Date;

  @Column()
  modified_date: Date;

  @Column()
  created_date: Date;

  @OneToOne(() => Orders, (orders) => orders.transaction)
  orders: Relation<Orders>;
}

@Entity("orders")
export class Orders {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => UserInformation)
  @JoinColumn({ name: "user_id" })
  user: UserInformation;

  @ManyToOne(() => Billings, (billing) => billing)
  @JoinColumn({ name: "billing_id" })
  billing: Billings;

  @ManyToOne(() => Transactions, (transactions) => transactions)
  @JoinColumn({ name: "transaction_id" })
  transaction: Transactions;

  @ManyToOne(() => SaleChannels)
  @JoinColumn({ name: "sale_channels_id" })
  sale_channel: SaleChannels;

  @ManyToOne(() => Gateways)
  @JoinColumn({ name: "gateway_id" })
  gateway: Gateways;

  @ManyToOne(() => Flights)
  @JoinColumn({ name: "flight_id" })
  flight: Flights;

  @OneToMany(() => OrderDetails, (orderDetails) => orderDetails.order)
  order_details: OrderDetails[];

  @Column()
  order_number: string;

  @Column()
  subtotal: number;

  @Column()
  total_quantity: number;

  @Column()
  total_discount: number;

  @Column()
  tax_fee: number;

  @Column()
  total: number;

  @Column()
  shipping_method: string;

  @Column()
  note: string;

  @Column()
  status_id: number;

  @Column()
  modified_date: Date;

  @Column()
  created_date: Date;
}

@Entity("order_details")
export class OrderDetails {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Orders, (order) => order.order_details)
  @JoinColumn({ name: "order_id" })
  order: Orders;

  @ManyToOne(() => Products)
  @JoinColumn({ name: "product_id" })
  product: Products;

  // @ManyToOne(() => ProductPrice)
  // @JoinColumn({ name: "price_id", referencedColumnName: "price_id" })
  // get product_price(): ProductPrice {
  //   return this.product?.price;
  // }

  @Column()
  quantity: number;

  @Column()
  modified_date: Date;
}

@Entity("orders")
export class CreateOrders {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  user_id: string;

  @Column()
  billing_id: string;

  @Column()
  transaction_id: string;

  @Column()
  sale_channels_id: number;

  @Column()
  gateway_id: number;

  @Column()
  flight_id: number;

  @Column()
  order_number: string;

  @Column()
  subtotal: number;

  @Column()
  total_quantity: number;

  @Column()
  total_discount: number;

  @Column()
  tax_fee: number;

  @Column()
  total: number;

  @Column()
  shipping_method: string;

  @Column()
  note: string;

  @Column()
  status_id: number;

  @Column()
  payment_status_id: number;

  @Column()
  fulfillment_status_id: number;

  @Column()
  modified_date: Date;
}

@Entity("orders")
export class OrderInformation {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  user_id: string;

  @Column()
  billing_id: string;

  @Column()
  transaction_id: string;

  @Column()
  sale_channels_id: number;

  @Column()
  gateway_id: number;

  @Column()
  flight_id: number;

  @Column()
  order_number: string;

  @Column()
  subtotal: number;

  @Column()
  total_quantity: number;

  @Column()
  total_discount: number;

  @Column()
  tax_fee: number;

  @Column()
  total: number;

  @Column()
  shipping_method: string;

  @Column()
  note: string;

  @Column()
  status_id: number;

  @Column()
  payment_status_id: number;

  @Column()
  fulfillment_status_id: number;

  @Column()
  modified_date: Date;
}

@Entity("order_details")
export class CreateOrderDetails {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  order_id: string;

  @Column()
  product_id: number;

  @Column()
  quantity: number;

  @Column()
  modified_date: Date;
}

@Entity("order_discount")
export class OrderDiscount {
  @PrimaryGeneratedColumn("uuid")
  id: string;
}
