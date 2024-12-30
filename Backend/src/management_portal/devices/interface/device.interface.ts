export interface DeviceRequestData {
  page?: number;
  pageSize?: number;
  filters?: string;
  supplierId?: string;
  type?: string;
}

export interface DeviceRequestDataInfo {
  data: {
    idAircraft?: number;
    idTypeDevice?: number;
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
  };
}

export interface QueryHandleDevice {
  id?: string;
  type?: string;
  typeChange?: string;
  idFLight?: number;
  typeChangeStatus?: string;
  aircraftId?: number;
}

export interface MaintenanceSyncRequestData {
  maintenanceStatus?: string;
  maintenanceCode?: string;
  reason?: string;
  description?: string;
  fromDate?: string;
  endDate?: string;
  statusId?: number;
}

export interface MaintenanceGetRequestData {
  page?: number;
  pageSize?: number;
  type?: string;
  filters?: string;
  fromDate?: Date;
  endDate?: Date;
}

export interface GetDeviceResponse {
  code: number;
  message: string;
  data?: unknown[];
  total?: number;
  totalPages?: number;
}

export interface DataDeviceResponse {
  code: number;
  message: string;
  data?: unknown[];
}

export interface DataDeviceHealthRes {
  deviceId?: string;
  status?: string;
  cpuUsage?: number;
  memoryUsage?: number;
  temperature?: number;
}

export interface DeviceMetrics {
  deviceId: string; // Mã thiết bị, kiểu GUID
  flightId: number; // ID chuyến bay
  speed: number; // Tốc độ truyền tải (Mbps)
  latency: number; // Độ trễ (ms)
  bandwidthUsage: number; // Băng thông sử dụng (%)
  packetLossRate: number; // Tỷ lệ mất gói tin (%)
  connectionQuality: number; // Chỉ số chất lượng kết nối (0-100)
  uptime: number; // Thời gian hoạt động (giây)
  downtime: number; // Thời gian không hoạt động (giây)
  unauthorizedAccessAttempts: number; // Số lượt truy cập trái phép
  failedConnections: number; // Số kết nối thất bại
  concurrentUsers: number; // Số người dùng đồng thời
}
