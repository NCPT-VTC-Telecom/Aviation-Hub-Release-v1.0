import { TypeOrmModule } from "@nestjs/typeorm";
import { CallBackLogRequestEntity } from "../../callback_log/entity/callback_log.entity";
import { TelecomRedeem, UserVerifyInformation } from "../entity/telecom.entity";
import { AircraftVNA, FlightsVietnamAirline } from "../../vietnam_airline/entity/flight.entity";
import { ApiSatelliteAAARequest } from "../../satellite/entity/satellite.entity";
import { Products } from "../../../management_portal/products/entity/product.entity";

export const TelecomEntity = TypeOrmModule.forFeature([CallBackLogRequestEntity, TelecomRedeem, FlightsVietnamAirline, UserVerifyInformation, AircraftVNA, ApiSatelliteAAARequest, Products]);
