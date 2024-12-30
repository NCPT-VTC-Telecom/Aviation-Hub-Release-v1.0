import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { responseMessage } from "src/utils/constant";
import { Gateways } from "../entity/gateway.entity";
import { GatewayEditManagementDto, GatewayManagementDto } from "src/management_portal/gateways/dto/gateway.dto";
import { OrderInformation } from "src/management_portal/orders/entity/order.entity";
import { LoggerService } from "../../common/logger_service/providers/log_service/log_service.service";

@Injectable()
export class GatewayService {
  constructor(
    @InjectRepository(Gateways)
    private readonly gatewayRepository: Repository<Gateways>,

    @InjectRepository(OrderInformation)
    private readonly orderRepository: Repository<OrderInformation>,

    private readonly logger: LoggerService
  ) {}

  private async calculateTotalIncome(gatewayIds: number[]): Promise<{ [key: number]: number }> {
    const incomeData: { [key: number]: number } = {};

    // Example logic to fetch total income per gateway id
    // Replace this with your actual logic to fetch income from OrderInformation
    const queryResults = await this.gatewayRepository.manager.query(`
      SELECT gateway_id, SUM(total) AS total_income
      FROM orders
      WHERE gateway_id IN (${gatewayIds.join(",")})
      GROUP BY gateway_id
    `);

    queryResults.forEach((result: any) => {
      incomeData[result.gateway_id] = parseFloat(result.total_income);
    });

    return incomeData;
  }

  async findGateway(page: number, pageSize: number, filters: string): Promise<any> {
    try {
      page = Math.max(1, page);
      const offset = (page - 1) * pageSize;

      // Step 1: Fetch Gateway Data with Filters
      let queryBuilder = this.gatewayRepository.createQueryBuilder("gateways").where("gateways.status_id != :statusId", { statusId: 13 }).orderBy("gateways.created_date", "DESC");

      if (filters) {
        queryBuilder = queryBuilder.andWhere(`(gateways.code LIKE :filters OR gateways.title LIKE :filters OR gateways.value LIKE :filters)`, { filters: `%${filters}%` });
      }

      const gatewayListData = await queryBuilder.skip(offset).take(pageSize).getMany();

      // Step 2: Fetch Income Data
      const gatewayIds = gatewayListData.map((gateway) => gateway.id);
      const incomeData = await this.calculateTotalIncome(gatewayIds);

      // Step 3: Map Income Data to Gateway Entities
      const gatewayDataWithIncome = gatewayListData.map((gateway) => {
        const income = incomeData[gateway.id] || 0; // Default to 0 if no income found
        return {
          ...gateway,
          income,
        };
      });

      const total = gatewayDataWithIncome.length; // Assuming total is the length of the array
      const totalPages = Math.ceil(total / pageSize);

      return {
        data: gatewayDataWithIncome,
        total,
        totalPages,
      };
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async handleAddGateway(dataGateway: GatewayManagementDto): Promise<any> {
    const { title, description, code, value } = dataGateway;

    const existGateway = await this.gatewayRepository.findOne({ where: { code: code } });

    if (existGateway) {
      throw new ConflictException({ code: -1, message: "Cổng thanh toán này đã tồn tại" });
    }

    try {
      const newGateway = this.gatewayRepository.create({
        title,
        description,
        code,
        value,
        status_id: 14,
      });
      await this.gatewayRepository.save(newGateway);

      return newGateway;
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async handleEditGateway(id: number, dataGateway: GatewayEditManagementDto): Promise<any> {
    try {
      const { title, description, code, value } = dataGateway;
      const existGateway = await this.gatewayRepository.findOne({ where: { id: id } });
      if (!existGateway) {
        throw new ConflictException({ code: -4, message: responseMessage.notFound });
      }
      await this.gatewayRepository.update(id, {
        title,
        description,
        code,
        value,
        modified_date: new Date(),
      });

      const updatedGateway = await this.gatewayRepository.findOne({ where: { id: id } });
      return updatedGateway;
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async handleDeleteGateway(id: number): Promise<Gateways> {
    try {
      // Check if the Gateway exists
      const existGateway = await this.gatewayRepository.findOne({ where: { id } });
      if (!existGateway) {
        throw new ConflictException({
          code: -4,
          message: responseMessage.notFound,
        });
      }
      // Change Status
      await this.gatewayRepository.update(id, {
        status_id: 13,
        modified_date: new Date(),
        deleted_date: new Date(),
      });
      return existGateway;
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }
}
