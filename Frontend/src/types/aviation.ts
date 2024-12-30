export type AirplaneInfo = {
  id: string;
  aircraft_type: string;
  tail_number: string;
  flight_phase: string;
  ifc_status: string;
  flight_number: string;
  destination: string;
  origin: string;
  departure_time: string;
  session_active: number;
  gps: { lat: number; lng: number };
  status_aircraft?: string;
  is_maintenance?: boolean;
};

export type NewAircraft = {
  id: number;
  flightNumber: string;
  tailNumber: string;
  model: string;
  manufacturer: string;
  modelType: string;
  capacity: number;
  maintenanceSchedule: Date | string | null;
  lastMaintenanceDate: Date | string | null;
  leasedAircraftStatus: string;
  yearManufactured: string | null | Date;
  ownership: string;
};

export interface AircraftData {
  id: number;
  flight_number: string;
  tail_number: string;
  model: string;
  manufacturer: string | null;
  model_type: string | null;
  capacity: number | null;
  maintenance_schedule: Date | string | null;
  last_maintenance_date: Date | string | null;
  leased_aircraft_status: string | null;
  year_manufactured: string | null | Date;
  ownership: string;
  status_id: number;
  modified_date: string;
  created_date: string;
  deleted_date: string | null;
}

export interface FlightData {
  id: number;
  departure_airport: string;
  arrival_airport: string;
  departure_time: string;
  arrival_time: string;
  flight_phase: number;
  airline: string;
  aircraft_id: number;
  status_id: number;
  lat_location: number;
  long_location: number;
  altitude: number;
  aircraft: AircraftData;
  status_description: string;
  route: string;
  tail_model: string;
  flight_times: string;
  sessions_count: number;
  total_data_usage: number;
}

export interface AirlineData {
  id: number;
  code: string;
  name: string;
  country: string;
  year_founded: string | Date;
  contact: string;
  email: string;
  status_id: number;
}

// export interface NewAirline {
//   id: number;
//   code: string;
//   name: string;
//   country: string;
//   yearFounded: string | Date;
//   contact: string;
//   email: string;
// }

export interface NewAirline {
  id: number;
  name: string;
  code: string;
  country: string;
  email: string;
  phoneNumber: string;
  description: string;
}

export interface AirlineData {
  id: number;
  name: string;
  code: string;
  country: string;
  email: string;
  phone_number: string;
  description: string;
}

export interface NewMaintenanceAircraft {
  id?: number;
  maintenanceStatus: string;
  reason: string;
  fromDate: string;
  endDate: string;
  description: string;
}
