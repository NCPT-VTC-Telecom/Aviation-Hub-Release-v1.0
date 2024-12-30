import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AddAirCraftInformationDto, ModifiedAirCraftInformationDto } from "src/management_portal/flights/dto/aircraft.dto";
import { Aircraft } from "src/management_portal/flights/entity/aircraft.entity";
// import { DeviceDetails, Devices } from "src/management_portal/devices/entity/devices.entity";
import { Flights } from "../entity/flights.entity";
import { Sessions } from "src/management_portal/sessions/entity/session.entity";
import { AircraftData } from "src/management_portal/flights/interface/flight.interface";
import { responseMessage } from "src/utils/constant";
import { Brackets, Repository } from "typeorm";
import { LoggerService } from "../../common/logger_service/providers/log_service/log_service.service";

@Injectable()
export class FlightService {
  constructor(
    @InjectRepository(Flights)
    private readonly flightsRepository: Repository<Flights>,
    @InjectRepository(Aircraft)
    private readonly aircraftRepository: Repository<Aircraft>,
    // @InjectRepository(Devices)
    // private readonly devicesRepository: Repository<Devices>,
    // @InjectRepository(DeviceDetails)
    // private readonly deviceDetailsRepository: Repository<DeviceDetails>,
    // @InjectRepository(Sessions)
    // private readonly sessionsRepository: Repository<Sessions>,
    private readonly logger: LoggerService
  ) {}
  //
  async findAirCraft(page: number, pageSize: number, filters: string): Promise<{ data: AircraftData[]; total: number; totalPages: number }> {
    try {
      // Ensure page is at least 1
      page = Math.max(1, page);
      const queryBuilder = this.aircraftRepository.createQueryBuilder("aircraft").andWhere("aircraft.status_id != :statusId", { statusId: 13 }).orderBy("aircraft.created_date", "DESC");
      const subQuery = queryBuilder
        .subQuery()
        .select("flights.aircraft_id", "aircraft_id")
        .addSelect("COUNT(flights.id)", "flight_count")
        .from(Flights, "flights")
        .where("flights.flight_phase = :flightPhase1 OR flights.flight_phase = :flightPhase2", { flightPhase1: "10", flightPhase2: "11" })
        .groupBy("flights.aircraft_id")
        .getQuery();
      queryBuilder.leftJoin(subQuery, "flight_counts", "flight_counts.aircraft_id = aircraft.id").addSelect("COALESCE(flight_counts.flight_count, 0)", "flight_count").orderBy("aircraft.id");

      if (filters) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where("aircraft.flight_number = :flightNumber", { flightNumber: filters })
              .orWhere("aircraft.tail_number = :tailNumber", { tailNumber: filters })
              .orWhere("aircraft.model = :model", { model: filters })
              .orWhere("aircraft.manufacturer = :manufacturer", { manufacturer: filters })
              .orWhere("aircraft.ownership = :ownership", { ownership: filters });
          })
        );
      }

      const [dataAircraft, totalItem] = await Promise.all([
        queryBuilder
          .skip((page - 1) * pageSize)
          .take(pageSize)
          .getRawAndEntities(),
        queryBuilder.getCount(),
      ]);

      const dataReturn = dataAircraft.entities.map((aircraft, index) => {
        const { flight_count } = dataAircraft.raw[index];
        const mapData: any = { ...aircraft, flight_count };
        return mapData;
      });

      const totalPages = Math.ceil(totalItem / pageSize);
      return {
        data: dataReturn.length > 0 ? dataReturn : [],
        total: totalItem,
        totalPages,
      };
    } catch (error) {
      console.log(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async handleAddAircraft(dataAirCraft: AddAirCraftInformationDto): Promise<any> {
    const { flightNumber, tailNumber, model, manufacturer, modelType, capacity, leasedAircraftStatus, yearManufactured, ownership } = dataAirCraft.data;

    const existAircraft = await this.aircraftRepository.findOne({ where: { tail_number: tailNumber } });

    const existFlightNumber = await this.aircraftRepository.findOne({ where: { flight_number: flightNumber } });

    if (existAircraft) {
      throw new ConflictException({ code: -1, message: "Số đuôi máy bay này đã tồn tại" });
    }

    if (existFlightNumber) {
      throw new ConflictException({ code: -1, message: "Số máy bay này đã tồn tại" });
    }
    const newAircraft = this.aircraftRepository.create({
      flight_number: flightNumber,
      tail_number: tailNumber,
      model,
      manufacturer,
      model_type: modelType,
      capacity,
      leased_aircraft_status: leasedAircraftStatus,
      year_manufactured: yearManufactured,
      ownership,
      status_id: 14,
    });
    await this.aircraftRepository.save(newAircraft);

    return newAircraft;
  }

  async handleEditAircraft(id: number, dataAirCraft: ModifiedAirCraftInformationDto): Promise<Aircraft> {
    const { flightNumber, tailNumber, model, manufacturer, modelType, capacity, leasedAircraftStatus, yearManufactured, ownership } = dataAirCraft.data;
    const existingAircraft = await this.aircraftRepository.findOne({
      where: [{ tail_number: tailNumber }],
    });

    if (!existingAircraft) {
      throw new ConflictException({ code: -4, message: responseMessage.notFound });
    }
    // Update the aircraft record
    await this.aircraftRepository.update(id, {
      flight_number: flightNumber,
      tail_number: tailNumber,
      model,
      manufacturer,
      model_type: modelType,
      capacity,
      leased_aircraft_status: leasedAircraftStatus,
      year_manufactured: yearManufactured,
      ownership,
      status_id: 14,
      modified_date: new Date(),
    });

    // Return the updated aircraft
    const updatedAircraft = await this.aircraftRepository.findOne({ where: { id } });
    return updatedAircraft;
  }

  async findFlights(page: number, pageSize: number, filters: string, departureTime: string, arrivalTime: string, flightPhase: string): Promise<{ data: any[]; total: number; totalPages: number }> {
    try {
      page = Math.max(1, page);

      const qb = this.flightsRepository
        .createQueryBuilder("flights")
        .leftJoinAndSelect("flights.aircraft", "aircraft")
        .leftJoinAndSelect("flights.status_description", "status")
        .andWhere("aircraft.status_id != :statusId", { statusId: 13 })
        .orderBy("flights.created_date", "DESC");

      const subQuery = qb
        .subQuery()
        .select("sessions.flight_id", "flight_id")
        .addSelect("SUM(sessions.total_data_usage)", "total_data_usage")
        .addSelect("COUNT(sessions.id)", "sessions_count")
        .from(Sessions, "sessions")
        .groupBy("sessions.flight_id")
        .getQuery();
      qb.leftJoin(subQuery, "total_sessions", "total_sessions.flight_id = flights.id").addSelect("COALESCE(total_sessions.total_data_usage, 0)", "total_data_usage").addSelect("COALESCE(total_sessions.sessions_count, 0)", "sessions_count");

      // let qbDevices = this.deviceDetailsRepository.createQueryBuilder("device_details").leftJoinAndSelect("device_details.devices", "devices").leftJoinAndSelect("devices.type", "device_type").leftJoinAndSelect("devices.status_description", "status");

      // const devicesData = await qbDevices.getMany();
      // console.log(devicesData);

      if (filters) {
        qb.where("flights.airline LIKE :filters", { filters: `%${filters}%` })
          .orWhere("aircraft.model LIKE :filters", { filters: `%${filters}%` })
          .orWhere("aircraft.flight_number = :flightNumber", { flightNumber: filters })
          .orWhere("aircraft.tail_number = :tailNumber", { tailNumber: filters })
          .orWhere("aircraft.manufacturer LIKE :filters", { filters: `%${filters}%` })
          .orWhere("status.description LIKE :filters", { filters: `%${filters}%` });
      }

      if (flightPhase) {
        qb.andWhere("flights.flight_phase = :flightPhase", { flightPhase: flightPhase });
      }

      if (departureTime) {
        qb.andWhere("flights.departure_time >= :departureTime", { departureTime });
      }

      if (arrivalTime) {
        qb.andWhere("flights.arrival_time <= :arrivalTime", { arrivalTime });
      }

      const [flightData, totalItem] = await Promise.all([
        qb
          .skip((page - 1) * pageSize)
          .take(pageSize)
          .getRawAndEntities(),
        qb.getCount(),
      ]);

      const flightDataWithAircraftDetails = flightData.entities.map((flight, index) => {
        const { total_data_usage, sessions_count } = flightData.raw[index];
        const mapData: any = { ...flight, flight_phase: +flight.flight_phase, status_description: flight.status_description.description, total_data_usage, sessions_count };
        return mapData;
      });

      const totalPages = Math.ceil(totalItem / pageSize);

      return {
        data: flightDataWithAircraftDetails.length > 0 ? flightDataWithAircraftDetails : [],
        total: totalItem,
        totalPages,
      };
    } catch (error) {
      console.log(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async handleDeleteAircraft(id: number): Promise<Aircraft> {
    // Check if the Aircraft exists
    const existingAircraft = await this.aircraftRepository.findOne({ where: { id, status_id: 14 } });
    if (!existingAircraft) {
      throw new ConflictException({
        code: -4,
        message: responseMessage.notFound,
      });
    }
    // Change Status
    await this.aircraftRepository.update(id, {
      status_id: 13,
      modified_date: new Date(),
      deleted_date: new Date(),
    });
    return existingAircraft;
  }
}
