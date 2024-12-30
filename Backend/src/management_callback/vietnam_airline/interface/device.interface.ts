interface DeviceMultipleRequestData {
  flightNumber?: string;
  deviceType?: string;
  name?: string;
  description?: string;
  dateOfManufacture?: string;
  placementLocation?: string;
  activationDate?: string;
  deactivationDate?: string;
  ipAddress?: string;
  port?: string;
  macAddress?: string;
  ipv6Address?: string;
  firmware?: string;
  wifiStandard?: string;
  manufacturer?: string;
  model?: string;
  cpuType?: string;
  supplier?: string;
}

export interface DeviceListVNAImportData {
  data: Array<DeviceMultipleRequestData>;
}

export interface AddDeviceVNARequestData {
  isEdit: boolean;
  data: Array<DeviceMultipleRequestData>;
}

interface DeviceHealthRequestData {
  deviceId: string;
  checkTime: Date;
  status: string;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  temprature: number;
}

export interface AddDeviceHealthRequestData {
  data: Array<DeviceHealthRequestData>;
}

export interface DeviceVNARequestData {
  page?: number;
  pageSize?: number;
  filters?: string;
}
