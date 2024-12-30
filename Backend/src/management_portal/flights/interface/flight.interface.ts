export interface FlightRequestData {
  page?: number;
  pageSize?: number;
  filters?: string;
  departureTime?: string;
  arrivalTime?: string;
  flightPhase?: string;
}

export interface AirCraftRequestCreateData {
  data: {
    flightNumber?: string;
    tailNumber?: string;
    model?: string;
    manufacturer?: string;
    modelType?: string;
    capacity?: number;
    leasedAircraftStatus?: string;
    yearManufactured?: string;
    ownership?: string;
  };
}

export interface AirCraftRequestModifiedData {
  data: {
    flightNumber?: string;
    tailNumber?: string;
    model?: string;
    manufacturer?: string;
    modelType?: string;
    capacity?: number;
    leasedAircraftStatus?: string;
    yearManufactured?: string;
    ownership?: string;
  };
}

export interface AircraftData {
  id?: number;
  flight_number?: string;
  tail_number?: string;
  model?: string;
  manufacturer?: string;
  model_type?: string;
  capacity?: number;
  leased_aircraft_status?: string;
  year_manufactured?: string;
  ownership?: string;
  status_id?: number;
  modified_date?: Date;
  created_date?: Date;
  deleted_date?: Date;
  flight_count?: number;
}

export interface AircraftMaintenanceGet {
  page?: number;
  pageSize?: number;
  type?: string;
  filters?: string;
  fromDate?: Date;
  endDate?: Date;
}

export interface AircraftMaintenance {
  maintenanceCode?: string;
  maintenanceStatus?: string;
  createdBy?: number;
  updateBy?: number;
  description?: string;
  reason?: string;
  fromDate?: Date;
  endDate?: Date;
  statusId?: number;
}
export interface AircraftMaintenanceRequestData {
  data?: AircraftMaintenance;
}
