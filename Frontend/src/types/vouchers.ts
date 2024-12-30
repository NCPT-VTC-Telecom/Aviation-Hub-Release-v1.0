export interface NewVoucherDiscount {
  name: string;
  quantity: number;
  quantityPerUser: number;
  dateFrom: string | null | Date;
  dateEnd: string | null | Date;
  minimal: number;
  maximal: number;
  code: string;
  type: string;
  id: number;
}

export interface VoucherDiscountData {
  id: number;
  name: string;
  quantity: number;
  quantity_per_user: number;
  date_from: string | null | Date;
  date_end: string | null | Date;
  minimal: number;
  maximal: number;
  deleted_date: string | null;
  modified_date: string | null;
  created_date: string;
  code: string;
  type: string;
  status_id: number;
}

export interface VoucherRedeemedData {
  id: string;
  campaign_id: string;
  product_id: number;
  voucher_code: string;
  type: string;
  created_by: number;
  status_id: number;
  end_date: string | null | Date;
  from_date: string | null | Date;
  created_date: string | null | Date;
  deleted_date: string | null | Date;
  modified_date: string | null | Date;
}

export interface NewVoucherRedeemed {
  id: string;
  fromDate: string | Date | null;
  endDate: string | Date | null;
  // type: string;
  productId: number;
}

export interface CampaignData {
  id: string;
  name: string;
  budget: number;
  start_date: string;
  end_date: string;
  description: string;
  status_id: number;
  created_date: string;
  modified_date: string | null;
  deleted_date: string | null;
  data: item[];
}

interface item {
  productId: number;
  quantity: number;
}

export interface NewCampaign {
  id: string;
  description: string;
  startDate: string | Date | null;
  endDate: string | Date | null;
  budget: number;
  data: item[];
}
