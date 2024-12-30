export interface DataDeviceHealth {
  deviceId?: string;
  status?: string;
  cpuUsage?: number;
  memoryUsage?: number;
  temperature?: number;
}

export interface DataIFCService {
  deviceId?: string;
  flightId?: number;
  speed?: number;
  latency?: number;
  bandwidthUsage?: number;
  packetLossRate?: number;
  connectionQuality?: number;
  uptime?: number;
  downtime?: number;
  unauthorizedAccessAttempts?: number;
  failedConnections?: number;
  concurrentUsers?: number;
}

export interface GetDataInterface {
  page?: number;
  pageSize?: number;
  filters?: string;
}

export interface DataUpdateDevice {
  deviceId?: string;
  firmware?: string;
  wifiStandard?: string;
  ipAddress?: string;
  port?: string;
}
