export interface FlightRequestImportData {
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: Date;
  arrivalTime: Date;
  flightPhase: string;
  airline: string;
  latLocation: string;
  longLocation: string;
  altitude: string;
}
interface DataMultipleAircraft {
  flightNumber: string;
  tailNumber: string;
  model: string;
  manufacturer: string;
  modelType: string;
  capacity: number;
  leasedAircraftStatus: string;
  yearManufactured: Date;
  ownership: string;
}

export interface AirCraftListImportData {
  data: Array<DataMultipleAircraft>;
}

export interface AircraftRequestImportData {
  isEdit: boolean;
  data: Array<DataMultipleAircraft>;
}

export interface ReturnImportFlightData {
  code: number;
  message: string;
}
