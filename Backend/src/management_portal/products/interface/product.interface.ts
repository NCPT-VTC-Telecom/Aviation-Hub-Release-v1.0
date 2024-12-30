export interface ProductRequestData {
  page?: number;
  pageSize?: number;
  filters?: string;
  type?: string;
  productId?: number;
}

export interface ProductSyncRequestData {
  data: {
    imageLink?: string;
    title?: string;
    type?: string;
    totalTime?: number;
    bandwidthUpload?: number;
    bandwidthDownload?: number;
    dataTotal?: number;
    dataUpload?: number;
    dataDownload?: number;
    dataPrice: ProductPriceData;
    productId?: number;
    ticketPlan?: string;
    name?: string;
    description?: string;
    productType?: string;
  };
}

export interface ProductPriceData {
  productId?: number;
  originalPrice?: number;
  newPrice?: number;
  currency?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface QueryProductData {
  id?: number;
  type?: string;
}

export interface ProductRes {
  code?: number;
  message?: string;
  data?: unknown[];
  total?: number;
  totalPages?: number;
}
