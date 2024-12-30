import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import axios from "axios";
import * as dotenv from "dotenv";
import { TicketRequestValidateData } from "src/management_callback/vietnam_airline/interface/ticket.interface";
import { Aircraft } from "src/management_portal/flights/entity/aircraft.entity";
import { Flights } from "src/management_portal/flights/entity/flights.entity";
import { UserInformation } from "src/management_portal/user/entity/user.entity";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";
import { responseMessage } from "src/utils/constant";
import { Repository } from "typeorm";
import { TicketVietnamAirline } from "../entity/ticket.entity";

dotenv.config();

@Injectable()
export class TicketVietnamAirlineService {
  constructor(
    @InjectRepository(TicketVietnamAirline)
    private readonly ticketRepository: Repository<TicketVietnamAirline>,
    @InjectRepository(UserInformation)
    private readonly userRepository: Repository<UserInformation>,
    @InjectRepository(Aircraft)
    private readonly airCraftsRepository: Repository<Aircraft>,
    @InjectRepository(Flights)
    private readonly flightRepository: Repository<Flights>,
    private readonly logger: LoggerService
  ) {}

  async validateTicket(dataSerial: TicketRequestValidateData): Promise<any> {
    try {
      const { serial } = dataSerial;
      // Check Error Serial
      if (serial === undefined || serial === "") return { code: -3, message: responseMessage.badRequest };
      const existTicket = await this.ticketRepository.findOneBy({ serial });
      if (existTicket) return { code: -11, message: responseMessage.existValue };

      // Validate Serial
      const url = `${process.env.VNA_SEVER_TEST}/validate_ticket`;
      const response = await axios.post(url, { serial });
      if (response?.data.code === -5) return { code: -5, message: responseMessage.notFound };

      // Import Data Ticket
      const { full_name, flight_number, depature_airport, arrival_airport, depature_time, arrival_time } = response?.data;

      const existUser = full_name ? await this.userRepository.findOne({ where: { fullname: full_name } }) : null;
      const existAircraft = flight_number ? await this.airCraftsRepository.findOneBy({ flight_number: flight_number }) : null;
      if (existAircraft === null || existUser === null) return { code: -5, message: responseMessage.notFound };
      const idAircraft = existAircraft?.id;
      const existFlight = await this.flightRepository.findOneBy({ departure_airport: depature_airport, arrival_airport: arrival_airport, departure_time: depature_time, arrival_time: arrival_time, aircraft_id: idAircraft });

      const newTicket = await this.ticketRepository.create({
        serial: serial,
        user_id: existUser?.id,
        flight_id: existFlight?.id,
        status_id: 11,
      });
      await this.ticketRepository.save(newTicket);
      return { code: 0, message: responseMessage.success };
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }
}
