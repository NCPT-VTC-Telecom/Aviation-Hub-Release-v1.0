export interface DateFilter {
  start_date: string;
  end_date: string;
}

export interface GenerateFilter {
  start_date: string;
  end_date: string;
  departure_airport: string;
  arrival_airport: string;
  tail_number: string;
  flight_number: string;
  flight_length: string;
  dpi_profile: string;
  device_type: string;
  slot: string;
}

export interface FilterAircraft {
  aircraft_type: string;
  airline: string;
  tail_number: string;
  flight_phase: string;
  ifc_status: string;
}

export interface FilterServicePerformance {
  start_date: string;
  end_date: string;
  departure_airport: string;
  arrival_airport: string;
  tail_number: string;
  flight_number: string;
  slot: string;
}

export interface FilterSessionPerformance {
  start_date: string | null;
  end_date: string | null;
  departure_airport: string;
  arrival_airport: string;
  tail_number: string;
  flight_number: string;
  flight_length: string;
  dpi_profile: string;
  device_type: string;
  slot: string;
}

export interface FilterRetailPerformance {
  start_date: string;
  end_date: string;
  departure_airport: string;
  arrival_airport: string;
  tail_number: string;
  flight_number: string;
  flight_length: string;
  dpi_profile: string;
  device_type: string;
  slot: string;
}

export interface FilterDataUsagePerformance {
  start_date: string | null;
  end_date: string | null;
  departure_airport: string;
  arrival_airport: string;
  tail_number: string;
  flight_number: string;
  flight_length: string;
  dpi_profile: string;
  slot: string;
}

export interface FilterDeviceHealth {
  start_date: string;
  end_date: string;
  airline: string;
  tail_number: string;
  slot: string;
}
