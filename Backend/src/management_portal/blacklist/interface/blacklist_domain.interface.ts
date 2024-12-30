class BlackListData {
  name: string;
  url: string;
  ipAddress: string;
  ipv6Address: string;
  dnsAddress: string;
  reason: string;
  categoryId: number;
}

export interface BlackListDomainSyncRequestData {
  data: BlackListData;
}

export interface QueryHandleBlackListDomain {
  id?: number;
  type?: string;
}
