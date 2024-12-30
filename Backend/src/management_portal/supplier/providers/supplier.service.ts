import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, Not, Repository } from "typeorm";
import { responseMessage } from "src/utils/constant";
import { Supplier } from "src/management_portal/supplier/entity/supplier.entity";
import { SupplierManagementDto } from "src/management_portal/supplier/dto/supplier.dto";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
    private readonly logger: LoggerService
  ) {}

  async findSupplier(page: number, pageSize: number, filters: string, type: string): Promise<any> {
    try {
      // Ensure page is at least 1
      page = Math.max(1, page);
      let queryBuilder = this.supplierRepository.createQueryBuilder("supplier").where("supplier.status_id != :statusId", { statusId: 13 }).orderBy("supplier.created_date", "DESC");

      if (type !== null) {
        queryBuilder.andWhere("supplier.type = :type", { type: type });
      }

      if (filters) {
        queryBuilder = queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where("supplier.name LIKE :filters", { filters: `%${filters}%` })
              .orWhere("supplier.description LIKE :filters", { filters: `%${filters}%` })
              .orWhere("supplier.address LIKE :filters", { filters: `%${filters}%` })
              .orWhere("supplier.contact LIKE :filters", { filters: `%${filters}%` })
              .orWhere("supplier.type LIKE :filters", { filters: `%${filters}%` });
          })
        );
      }

      const [supplierData, total] = await queryBuilder
        .skip((page - 1) * pageSize)
        .take(pageSize)
        .getManyAndCount();

      const totalPages = Math.ceil(total / pageSize);

      return {
        data: supplierData.length > 0 ? supplierData : [],
        total,
        totalPages,
      };
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async handleAddSupplier(dataSupplier: SupplierManagementDto): Promise<any> {
    const { name, description, address, contact, type, status } = dataSupplier;
    const existSupplier = await this.supplierRepository.findOne({ where: { name: name } });

    if (existSupplier) {
      throw new ConflictException({ code: -1, message: "Nhà cung cấp đã tồn tại" });
    }
    const newSupplier = this.supplierRepository.create({
      name,
      description,
      address,
      contact,
      type,
      status_id: status == "active" ? 14 : 19,
    });
    await this.supplierRepository.save(newSupplier);
    return newSupplier;
  }

  async handleEditSupplier(id: string, dataSupplier: SupplierManagementDto): Promise<any> {
    const { name, description, contact, address, type } = dataSupplier;

    // Check if the aircraft exists
    const existingSupplier = await this.supplierRepository.findOne({ where: { id } });

    if (!existingSupplier) {
      throw new ConflictException({ code: -4, message: responseMessage.notFound });
    }

    // Check for tail number conflict with other aircrafts
    const nameSupplierConflict = await this.supplierRepository.findOne({
      where: { name: name },
    });
    if (nameSupplierConflict) {
      throw new ConflictException({ code: -1, message: "Tên đối tác cung cấp này đã tồn tại" });
    }

    // Update the aircraft record
    await this.supplierRepository.update(id, {
      name,
      description,
      contact,
      address,
      type,
      modified_date: new Date(),
    });

    // Return the updated aircraft
    const updatedSupplier = await this.supplierRepository.findOne({ where: { id } });
    return updatedSupplier;
  }

  async handleDeleteSupplier(id: string): Promise<any> {
    // Check if the Gateway exists
    const existingSupplier = await this.supplierRepository.findOne({ where: { id, status_id: 14 } });
    if (!existingSupplier) {
      throw new ConflictException({
        code: -4,
        message: responseMessage.notFound,
      });
    }

    // Change Status
    await this.supplierRepository.update(id, {
      status_id: 13,
      modified_date: new Date(),
      deleted_date: new Date(),
    });
    return existingSupplier;
  }
}
