export interface TicketRequestValidateData {
  serial?: string;
}

export interface TicketResFormVNA {
  code: number;
  message: string;
  data: DataTicketVNA;
}
interface DataTicketVNA {
  id: number;
  serial: string;
  user_name: string;
  flight_number: number;
  depature_airport: string;
  arrival_airport: string;
  depature_time: string;
  arrival_time: string;
}
