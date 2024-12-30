class BlackListData {
  deviceName: string;
  ipAddress: string;
  ipv6Address: string;
  macAddress: string;
  reason: string;
}

export interface BlackListDeviceSyncRequestData {
  data: BlackListData;
}

export interface QueryHandleBlackListDevice {
  id?: number;
  type?: string;
}
