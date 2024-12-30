import { FlightData } from './aviation';

export interface Billing {
  id: string;
  billing_number: string;
  order_number: string;
  total_quantity: number;
  total: number;
  status_id: number;
  billing_date: Date;
  modified_date: Date;
}

export interface Transaction {
  id: string;
  order_number: string;
  subtotal: number;
  total: number;
  status_id: number;
  transaction_date: Date;
  modified_date: Date;
}

interface User {
  id: string;
  fullname: string;
  email: string;
  phone_number: string;
  gender: string;
  citizen_id: string;
  address: string;
  ward: string;
  district: string;
  province: string;
  country: string;
  postcode: string;
  username: string;
  status_id: number;
  modified_date: string;
  deleted_date: string;
}

//Payment Method

export interface NewPaymentMethod {
  id: number;
  code: string;
  title: string;
  description: string;
}

export interface PaymentMethodData {
  id: number;
  code: string;
  title: string;
  description: string;
  value: string;
  status_id: number;
  modified_date: string;
  deleted_date: string;
}

//Gateway

export interface NewGateway {
  id: number;
  code: string;
  title: string;
  description: string;
  value: string;
}

export interface GatewayData {
  id: number;
  code: string;
  title: string;
  description: string;
  value: string;
  status_id: number;
  income: number;
  modified_date: string;
  deleted_date: string;
}

interface Product {
  id: number;
  price_id: number;
  image_link: string;
  title: string;
  description: string;
  type: string;
  total_time: number;
  bandwidth_upload: number;
  bandwidth_download: number;
  data_total: number;
  data_upload: number;
  data_download: number;
  status_id: number;
  price: ProductPrice;
  deleted_date: string | null;
  modified_date: string;
  created_date: string;
}

interface ProductPrice {
  id: number;
  original_price: number;
  new_price: number;
  currency: string;
  start_date: string;
  end_date: null;
  created_by: number;
  status_id: number;
  deleted_date: null;
  modified_date: string;
  created_date: string;
}

export interface OrderDetail {
  id: string;
  quantity: number;
  title: string;
  modified_date: string | null;
  product: Product;
}

export interface Order {
  id: string;
  order_number: string;
  subtotal: number;
  total_quantity: number;
  total_discount: number;
  tax_fee: number;
  total: number;
  shipping_method: string;
  note: string | null;
  status_id: number;
  modified_date: string | null;
  created_date: string;
  billing: Billing;
  transaction: Transaction;
  user: User;
  payment_method: PaymentMethodData;
  gateway: GatewayData;
  flight: FlightData;
  order_details: OrderDetail[];
}
