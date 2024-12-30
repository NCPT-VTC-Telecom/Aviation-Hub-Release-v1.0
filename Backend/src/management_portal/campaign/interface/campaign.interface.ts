export interface ItemWithCampaignData {
  productId?: number;
  quantity?: number;
}
export interface CampaignDataReq {
  name?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  budget?: number;
  data?: ItemWithCampaignData[];
}

export interface FilterCampaignList {
  page?: number;
  pageSize?: number;
  filters?: string;
}

export interface CampaignResponseWthData {
  code: number;
  message: string;
  data?: unknown[];
  total?: number;
  totalPages?: number;
}

export interface HandleCampaignResponse {
  code: number;
  message: string;
}

export interface QueryHandleListCampaign {
  id?: string;
  type?: string;
}

export interface BodyHandleListCampaign {
  name?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  budget?: number;
}
