export interface ProductData {
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
  product_sold: number;
  total_revenue: number;
  deleted_date: Date;
  modified_date: Date;
  created_date: Date | string;
  price: PriceDetails;
}

interface PriceDetails {
  id: number;
  original_price: number;
  new_price: number;
  currency: string;
  start_date: string | Date | null;
  end_date: string | Date | null;
  created_by: number;
  status_id: number;
  deleted_date: Date | null;
  modified_date: Date;
  created_date: Date;
}

export interface NewProduct {
  id: number;
  imageLink: string;
  title: string;
  description: string;
  type: string;
  totalTime: number;
  bandwidthUpload: number;
  bandwidthDownload: number;
  dataTotal: number;
  dataUpload: number;
  dataDownload: number;
  dataPrice: DataPriceDetails;
}

interface DataPriceDetails {
  originalPrice: number;
  newPrice: number;
  currency: string;
  startDate: Date | string | null;
  endDate: Date | string | null;
}

export interface BundleData {
  id: number;
  name: string;
  description: string;
  product_id: number;
  product_type: string;
  product_sold: number;
  sku: string;
  status_id: number;
  ticket_plan?: string;
  sage: string;
  created_date: string;
  modified_date: string;
  deleted_date: string;
}

export interface NewBundle {
  id: number;
  name: string;
  productId: number;
  ticketPlan?: string;
  productType?: string;
  description: string;
}
