class BlackListData {
  name: string;
  code: string;
  description: string;
}

export interface BlackListCategorySyncRequestData {
  data: BlackListData;
}

export interface QueryHandleBlackListCategory {
  id?: number;
  type?: string;
}
