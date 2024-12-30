import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, Repository } from "typeorm";
import { Aircraft, AircraftMaintenance, MaintenanceAircraftHist } from "../entity/aircraft.entity";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";
import { responseMessage } from "src/utils/constant";
import { AircraftMaintenanceRequestData } from "../interface/flight.interface";
import { generateCode } from "src/utils/common";

@Injectable()
export class MaintenanceAircraftService {
  constructor(
    @InjectRepository(Aircraft)
    private readonly aircraftRepository: Repository<Aircraft>,
    @InjectRepository(AircraftMaintenance)
    private readonly aircraftMaintenanceRepository: Repository<AircraftMaintenance>,
    @InjectRepository(MaintenanceAircraftHist)
    private readonly aircraftMaintenanceHistRepository: Repository<MaintenanceAircraftHist>,

    private readonly logger: LoggerService
  ) {}
  private readonly handleAddHist = async (id: number, status: string, fromDate: Date, endDate: Date, statusId: number) => {
    try {
      const newHist = await this.aircraftMaintenanceHistRepository.create({ maintenance_id: id, maintenance_status: status, from_date: fromDate, end_date: endDate, status_id: statusId, modified_date: new Date() });
      await this.aircraftMaintenanceHistRepository.save(newHist);
      return true;
    } catch (error) {
      return false;
    }
  };
  async findAircraftMaintenance(page: number, pageSize: number, filters: string, fromDate?: string, endDate?: string): Promise<any> {
    try {
      page = Math.max(1, page);
      let qb = this.aircraftMaintenanceRepository
        .createQueryBuilder("maintenance_aircrafts")
        .leftJoinAndSelect("maintenance_aircrafts.aircraft", "aircraft")
        .where("maintenance_aircrafts.status_id != :statusId", { statusId: 13 })
        .orderBy("maintenance_aircrafts.created_date", "DESC");

      if (filters) {
        qb = qb.andWhere(
          new Brackets((qb) => {
            qb.orWhere("maintenance_aircrafts.maintenance_code = :MaintenanceCode", { MaintenanceCode: filters }).orWhere("maintenance_aircrafts.reason LIKE :Reason", { Reason: `%${filters}%` });
          })
        );
      }

      if (fromDate.length > 0 && endDate.length > 0) {
        qb = qb.andWhere(
          new Brackets((qb) => {
            qb.orWhere("maintenance_aircrafts.from_date >= :fromDate", { fromDate: new Date(fromDate) }).orWhere("maintenance_aircrafts.end_date <= :endDate", { endDate: new Date(endDate) });
          })
        );
      }

      const [maintenancesData, total] = await qb
        .skip((page - 1) * pageSize)
        .take(pageSize)
        .getManyAndCount();

      const totalPages = Math.ceil(total / pageSize);
      return {
        data: maintenancesData.length > 0 ? maintenancesData : [],
        total,
        totalPages,
      };
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async findAircraftMaintenanceHist(page: number, pageSize: number, filters: string, fromDate?: string, endDate?: string) {
    try {
      page = Math.max(1, page);
      let qb = this.aircraftMaintenanceHistRepository.createQueryBuilder("maintenance_aircrafts_hist").where("maintenance_aircrafts_hist.status_id != :statusId", { statusId: 13 }).orderBy("maintenance_aircrafts_hist.created_date", "DESC");

      if (filters) {
        qb = qb.andWhere(
          new Brackets((qb) => {
            qb.orWhere("maintenance_aircrafts_hist.maintenance_id = :MaintenanceId", { MaintenanceId: filters }).orWhere("maintenance_aircrafts_hist.maintenance_status LIKE :MaintenanceStatus", { MaintenanceStatus: `%${filters}%` });
          })
        );
      }

      if (fromDate.length > 0 && endDate.length > 0) {
        qb = qb.andWhere(
          new Brackets((qb) => {
            qb.orWhere("maintenance_aircrafts_hist.from_date >= :fromDate", { fromDate: new Date(fromDate) }).orWhere("maintenance_aircrafts_hist.end_date <= :endDate", { endDate: new Date(endDate) });
          })
        );
      }

      const [maintenancesHistData, total] = await qb
        .skip((page - 1) * pageSize)
        .take(pageSize)
        .getManyAndCount();

      const totalPages = Math.ceil(total / pageSize);
      return {
        data: maintenancesHistData.length > 0 ? maintenancesHistData : [],
        total,
        totalPages,
      };
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async addAircraftMaintenanceSchedule(id: number, dataMaintenanceSchedule: AircraftMaintenanceRequestData): Promise<any> {
    try {
      const { reason, description, endDate, fromDate } = dataMaintenanceSchedule.data;
      const count = await this.aircraftMaintenanceRepository.count();
      const maintenanceCode = generateCode(count + 1);
      const newFromDate = new Date(fromDate);
      const newEndDate = new Date(endDate);

      const queryBuilder = this.aircraftRepository.createQueryBuilder("aircraft").where("aircraft.status_id != :statusId", { statusId: 13 }).andWhere("aircraft.id = :id", { id });
      const existAircraft = await queryBuilder.getOne();
      if (!existAircraft) {
        throw new ConflictException({ code: -4, message: responseMessage.notFound });
      }

      const qbMaintenance = this.aircraftMaintenanceRepository
        .createQueryBuilder("maintenance_aircrafts")
        .where("maintenance_aircrafts.status_id NOT IN (:...StatusId)", { StatusId: [13, 19] })
        .andWhere("maintenance_aircrafts.aircraft_id = :id", { id });
      const existMaintenanceSchedule = await qbMaintenance.getOne();
      if (existMaintenanceSchedule) {
        throw new ConflictException({ code: -1, message: "Máy bay đã có lịch bảo trì" });
      }

      const newMaintenanceSchedule = this.aircraftMaintenanceRepository.create({
        aircraft_id: id,
        maintenance_status: "Maintenance",
        created_by: 1,
        description,
        reason,
        maintenance_code: maintenanceCode,
        from_date: newFromDate,
        end_date: newEndDate,
        status_id: 14,
      });
      const newAddedMaintenance = await this.aircraftMaintenanceRepository.save(newMaintenanceSchedule);
      const newMaintenanceHist = await this.handleAddHist(newAddedMaintenance.id, "Maintenance", newFromDate, newEndDate, 14);
      if (!newMaintenanceHist) {
        throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
      }

      return newAddedMaintenance;
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      if (error instanceof ConflictException) {
        throw error; // Re-throw the ConflictException with its specific message
      } else {
        throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
      }
    }
  }

  async editAircraftMaintenanceSchedule(id: number, dataMaintenanceSchedule: AircraftMaintenanceRequestData): Promise<any> {
    try {
      const { reason, description, maintenanceCode, maintenanceStatus, statusId, endDate, fromDate } = dataMaintenanceSchedule.data;
      let newFromDate: Date;
      let newEndDate: Date;

      if (fromDate) {
        newFromDate = new Date(fromDate);
      }
      if (endDate) {
        newEndDate = new Date(endDate);
      }

      const queryBuilder = this.aircraftRepository.createQueryBuilder("aircraft").where("aircraft.status_id != :statusId", { statusId: 13 }).andWhere("aircraft.id = :id", { id });
      const existAircraft = await queryBuilder.getOne();
      if (!existAircraft) {
        throw new ConflictException({ code: -4, message: responseMessage.notFound });
      }

      const qbMaintenance = this.aircraftMaintenanceRepository
        .createQueryBuilder("maintenance_aircrafts")
        .where("maintenance_aircrafts.maintenance_code = :MaintenanceCode", { MaintenanceCode: maintenanceCode })
        .andWhere("maintenance_aircrafts.status_id NOT IN (:...StatusId)", { StatusId: [13, 19] })
        .andWhere("maintenance_aircrafts.aircraft_id = :id", { id });
      const existMaintenanceSchedule = await qbMaintenance.getOne();
      if (!existMaintenanceSchedule) {
        throw new ConflictException({ code: -1, message: responseMessage.badRequest });
      }

      await this.aircraftMaintenanceRepository.update(
        { aircraft_id: id, maintenance_code: maintenanceCode },
        {
          update_by: 1,
          reason,
          description,
          maintenance_status: maintenanceStatus,
          status_id: statusId,
          from_date: newFromDate,
          end_date: newEndDate,
          modified_date: new Date(),
        }
      );
      await this.handleAddHist(existMaintenanceSchedule.id, maintenanceStatus, newFromDate, newEndDate, statusId);

      return existMaintenanceSchedule;
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      if (error instanceof ConflictException) {
        throw error; // Re-throw the ConflictException with its specific message
      } else {
        throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
      }
    }
  }

  async deleteMaintenanceSchedule(id: number, dataMaintenanceSchedule: AircraftMaintenanceRequestData): Promise<any> {
    try {
      const { maintenanceCode, endDate, fromDate } = dataMaintenanceSchedule.data;
      const newFromDate = new Date(fromDate);
      const newEndDate = new Date(endDate);

      const queryBuilder = this.aircraftRepository.createQueryBuilder("aircraft").where("aircraft.status_id != :statusId", { statusId: 13 }).andWhere("aircraft.id = :id", { id });
      const existAircraft = await queryBuilder.getOne();
      if (!existAircraft) {
        throw new ConflictException({ code: -4, message: responseMessage.notFound });
      }

      const qbMaintenance = this.aircraftMaintenanceRepository
        .createQueryBuilder("maintenance_aircrafts")
        .where("maintenance_aircrafts.maintenance_code = :MaintenanceCode", { MaintenanceCode: maintenanceCode })
        .andWhere("maintenance_aircrafts.status_id NOT IN (:...StatusId)", { StatusId: [13, 19] })
        .andWhere("maintenance_aircrafts.aircraft_id = :id", { id });
      const existMaintenanceSchedule = await qbMaintenance.getOne();
      if (!existMaintenanceSchedule) {
        throw new ConflictException({ code: -1, message: responseMessage.badRequest });
      }

      await this.aircraftMaintenanceRepository.update({ aircraft_id: id, maintenance_code: maintenanceCode }, { maintenance_status: "Deleted", status_id: 13, deleted_date: new Date() });
      await this.handleAddHist(existMaintenanceSchedule.id, "Deleted", newFromDate, newEndDate, 13);

      return existMaintenanceSchedule;
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      if (error instanceof ConflictException) {
        throw error; // Re-throw the ConflictException with its specific message
      } else {
        throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
      }
    }
  }
}
