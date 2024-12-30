import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FlightVNADto } from "src/management_callback/vietnam_airline/dto/flight.dto";
import { AirCraftListImportData, ReturnImportFlightData } from "src/management_callback/vietnam_airline/interface/flight.interface";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";
import { responseMessage } from "src/utils/constant";
import { Between, Repository } from "typeorm";
import { AircraftVNA, FlightsVietnamAirline } from "../entity/flight.entity";
@Injectable()
export class FlightVietnamAirlineService {
  constructor(
    @InjectRepository(FlightsVietnamAirline)
    private readonly flightsRepository: Repository<FlightsVietnamAirline>,
    @InjectRepository(AircraftVNA)
    private readonly aircraftRepository: Repository<AircraftVNA>,

    private readonly logger: LoggerService
  ) {}

  async handleImportFlight(dataImport: FlightVNADto): Promise<ReturnImportFlightData> {
    try {
      const { airline, arrivalAirport, arrivalTime, departureAirport, departureTime, flightNumber, flightPhase, latLocation, longLocation, altitude } = dataImport;
      const parseStringFlightPhase = this.parseFlightPhase(flightPhase);
      const existAircraft = await this.aircraftRepository.findOne({ where: { flight_number: flightNumber } });
      if (!existAircraft) {
        throw new ConflictException({ code: -1, message: "Số đuôi máy bay không tồn tại" });
      }
      const parsedDepartureTime = new Date(departureTime);
      const parsedArrivalTime = new Date(arrivalTime);

      if (parsedDepartureTime >= parsedArrivalTime) {
        throw new ConflictException({ code: -1, message: "Thời gian khởi hành phải trước thời gian đến" });
      }

      const currentDate = new Date();
      const twentyFourHoursAgo = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
      const aircraftId = existAircraft.id;

      const existFlight = await this.flightsRepository.findOne({
        where: {
          aircraft_id: aircraftId,
          arrival_airport: arrivalAirport,
          departure_airport: departureAirport,
          created_date: Between(twentyFourHoursAgo, currentDate),
        },
      });

      if (existFlight) {
        if (parseStringFlightPhase == existFlight.flight_phase || latLocation == existFlight.lat_location || longLocation == existFlight.long_location) {
          throw new ConflictException({ code: -1, message: "Chuyến bay này đã tồn tại" });
        }
        const updateFlight = await this.flightsRepository.update(
          { aircraft_id: aircraftId, arrival_airport: arrivalAirport, departure_airport: departureAirport, created_date: Between(twentyFourHoursAgo, currentDate) },
          {
            arrival_airport: arrivalAirport,
            departure_airport: departureAirport,
            arrival_time: parsedArrivalTime,
            departure_time: parsedDepartureTime,
            flight_phase: parseStringFlightPhase,
            lat_location: latLocation,
            long_location: longLocation,
            altitude: altitude,
          }
        );
        if (updateFlight) return { code: 0, message: responseMessage.success };
      } else {
        const newFlight = this.flightsRepository.create({
          aircraft_id: aircraftId,
          arrival_airport: arrivalAirport,
          departure_airport: departureAirport,
          arrival_time: parsedArrivalTime,
          departure_time: parsedDepartureTime,
          flight_phase: parseStringFlightPhase,
          lat_location: latLocation,
          long_location: longLocation,
          altitude: altitude,
          airline,
          status_id: 14,
        });

        await this.flightsRepository.save(newFlight);
        return { code: 0, message: responseMessage.success };
      }
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async handleImportAircraft(isEdit: boolean, dataImport: AirCraftListImportData): Promise<any> {
    try {
      const dataAircrafts = dataImport?.data;
      const existedList = [];
      if (!Array.isArray(dataAircrafts)) return null;
      const addedList = [];
      for (const item of dataAircrafts) {
        const { capacity, flightNumber, leasedAircraftStatus, manufacturer, model, modelType, ownership, tailNumber, yearManufactured } = item;
        // Check if the aircraft already exists in the database
        const existAircraft = await this.aircraftRepository.findOne({
          where: { tail_number: tailNumber },
        });

        if (existAircraft) {
          // If aircraft exists, continue to the next item
          if (isEdit) {
            await this.aircraftRepository.update(
              { id: existAircraft.id },
              {
                capacity,
                flight_number: flightNumber,
                leased_aircraft_status: leasedAircraftStatus,
                manufacturer,
                model,
                model_type: modelType,
                ownership,
                tail_number: tailNumber,
                year_manufactured: new Date(yearManufactured),
                status_id: 14, // Assuming a default status_id value
                modified_date: new Date(),
              }
            );
            continue;
          } else {
            existedList.push(tailNumber);
            continue;
          }
        } else {
          // Create a new aircraft object with the correct property names
          const newAircraft = this.aircraftRepository.create({
            capacity,
            flight_number: flightNumber,
            leased_aircraft_status: leasedAircraftStatus,
            manufacturer,
            model,
            model_type: modelType,
            ownership,
            tail_number: tailNumber,
            year_manufactured: new Date(yearManufactured),
            status_id: 14, // Assuming a default status_id value
            modified_date: new Date(), // Assuming current date as modified_date
          });

          const addedAircraft = await this.aircraftRepository.save(newAircraft);
          addedList.push(addedAircraft);

          continue;
        }
      }
      if (existedList?.length > 0) {
        return { note: "Máy bay đã tồn tại", data: existedList };
      } else {
        return { note: "Máy bay được thêm", data: addedList };
      }
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async findAirCraft(page: number, pageSize: number, filters: string): Promise<{ data: any; total: number; totalPages: number }> {
    try {
      // Ensure page is at least 1
      page = Math.max(1, page);
      const queryBuilder = this.aircraftRepository.createQueryBuilder("aircraft").andWhere("aircraft.status_id != :statusId", { statusId: 13 });

      if (filters) {
        const filterConditions = ["aircraft.flight_number = :filters", "aircraft.tail_number = :filters", "aircraft.model LIKE :filters", "aircraft.manufacturer LIKE :filters", "aircraft.ownership LIKE :filters"].join(" OR ");

        queryBuilder.andWhere(filterConditions, { filters: `%${filters}%` });
      }

      const [aircraftData, total] = await queryBuilder
        .skip((page - 1) * pageSize)
        .take(pageSize)
        .getManyAndCount();

      const totalPages = Math.ceil(total / pageSize);

      return {
        data: aircraftData.length > 0 ? aircraftData : [],
        total,
        totalPages,
      };
    } catch (error) {
      // this.logger.error("Error finding aircraft", error.stack);
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  private parseFlightPhase(flightPhase: string) {
    switch (flightPhase) {
      case "Scheduled":
        return "0";
      case "Pre-departure":
        return "1";
      case "Clearance to Taxi":
        return "2";
      case "Take-off":
        return "3";
      case "Initial climb":
        return "4";
      case "Climb to cruise altitude":
        return "5";
      case "Cruise altitude":
        return "6";
      case "Descent":
        return "7";
      case "Approach":
        return "8";
      case "Landing":
        return "9";
      case "Taxi to the terminal":
        return "10";
      case "Post flight":
        return "11";
      default:
        return "0";
    }
  }
}
