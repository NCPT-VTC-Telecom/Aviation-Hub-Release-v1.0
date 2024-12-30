export interface RestrictionDevice {
  id: number;
  device_name: string;
  mac_address: string;
  device_type: string;
  reason: string;
  status_id: number;
  ip_address: string;
  ipv6_address: string;
}

export interface ActionRestrictionDevice {
  id: number;
  deviceName: string;
  macAddress: string;
  deviceType: string;
  reason: string;
  ipAddress: string;
  ipv6Address: string;
}
