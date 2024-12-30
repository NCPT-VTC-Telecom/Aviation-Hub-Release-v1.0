import { TypeOrmModule } from "@nestjs/typeorm";
import { TicketVietnamAirline } from "../entity/ticket.entity";
import { CallBackLogRequestEntity } from "../../callback_log/entity/callback_log.entity";
import { UserInformation } from "../../../management_portal/user/entity/user.entity";
import { Flights } from "../../../management_portal/flights/entity/flights.entity";
import { Aircraft } from "../../../management_portal/flights/entity/aircraft.entity";
import { ApiSatelliteAAARequest } from "../../satellite/entity/satellite.entity";
import { AircraftVNA, FlightsVietnamAirline } from "../entity/flight.entity";
import { DeviceDetailsVNA, DeviceHealthVNA, DevicesVNA, DeviceTypeVNA, SupplierVNA } from "../entity/device.entity";

export const TicketEntity = TypeOrmModule.forFeature([TicketVietnamAirline, CallBackLogRequestEntity, UserInformation, Flights, Aircraft, ApiSatelliteAAARequest]);

export const FlightEntity = TypeOrmModule.forFeature([FlightsVietnamAirline, AircraftVNA, CallBackLogRequestEntity, ApiSatelliteAAARequest]);

export const DeviceEntity = TypeOrmModule.forFeature([AircraftVNA, CallBackLogRequestEntity, DevicesVNA, SupplierVNA, DeviceDetailsVNA, DeviceTypeVNA, ApiSatelliteAAARequest, DeviceHealthVNA]);
