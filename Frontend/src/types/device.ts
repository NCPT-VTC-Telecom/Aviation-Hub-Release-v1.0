import { AircraftData } from './aviation';

export interface NewDevice {
  id: string;
  idAircraft: number;
  idTypeDevice: number;
  name: string;
  description: string;
  dateOfManufacture: Date | string | null;
  placementLocation: string;
  activationDate: Date | string | null;
  deactivationDate: Date | string | null;
  ipAddress: string;
  port: string;
  macAddress: string;
  ipv6Address: string;
  firmware: string;
  wifiStandard: string;
  manufacturer: string;
  model: string;
  cpuType: string;
  supplier: string;
}

export interface DeviceData {
  id_device: string;
  name: string;
  description: string;
  placement_location: string;
  activation_date: Date | string | null;
  deactivation_date: Date | string | null;
  type: string;
  ip_address: string;
  last_ip: string;
  port: string;
  mac_address: string;
  ipv6_address: string;
  firmware: string;
  wifi_standard: string;
  manufacturer: string;
  manufacturer_date: string;
  model: string;
  cpu_type: string;
  supplier: string;
  status_id: number;
  status_description: string;
  aircraft: AircraftData;
}

export interface DeviceHealth {
  id_device: string;
  status: string;
  health_check_time: string;
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  temperature: number;
  name: string;
  description: string;
  placement_location: string;
  activation_date: string;
  deactivation_date: string | null;
  type: string;
  ip_address: string;
  last_ip: string;
  port: string;
  mac_address: string;
  ipv6_address: string;
  firmware: string;
  wifi_standard: string;
  manufacturer: string;
  manufacturer_date: string;
  model: string;
  cpu_type: string;
  supplier: string;
  status_id: number;
  status_description: string;
}
