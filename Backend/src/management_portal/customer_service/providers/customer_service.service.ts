import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CustomerService } from "src/management_portal/customer_service/entity/customer_service.entity";
import { CustomerServiceHist } from "src/management_portal/customer_service/entity/customer_service_hist.entity";
import { UserInformation } from "src/management_portal/user/entity/user.entity";

import { AddCustomerService, EditCustomerServiceData } from "src/management_portal/customer_service/interface/customer_service.interface";
import { responseMessage } from "src/utils/constant";
import { Repository } from "typeorm";
import { LoggerService } from "../../common/logger_service/providers/log_service/log_service.service";

@Injectable()
export class CustomerServiceService {
  constructor(
    @InjectRepository(CustomerService)
    private readonly customerServiceRepository: Repository<CustomerService>,
    @InjectRepository(CustomerServiceHist)
    private readonly customerServiceHistRepository: Repository<CustomerServiceHist>,
    @InjectRepository(UserInformation)
    private readonly userRepository: Repository<UserInformation>,
    private readonly logger: LoggerService
  ) {}

  async getDataCustomerService(page: number, pageSize: number, startDate: Date, endDate: Date, statusId: number, label: string): Promise<any> {
    try {
      page = Math.max(1, page);
      const adjustedEndDate = new Date(endDate);
      adjustedEndDate.setHours(23, 59, 59, 999);
      const parseIntStatusId = +statusId;

      const qb = this.customerServiceRepository
        .createQueryBuilder("customer_service_request")
        .leftJoinAndSelect("customer_service_request.user_sender", "user_sender")
        .andWhere("customer_service_request.created_date BETWEEN :startDate AND :endDate", { startDate, endDate: adjustedEndDate })
        .orderBy("customer_service_request.created_date", "DESC");

      if (statusId !== null && parseIntStatusId) {
        qb.andWhere("customer_service_request.status_id = :parseIntStatusId", { parseIntStatusId });
      }

      if (label !== null) {
        qb.andWhere("customer_service_request.label = :label", { label: label });
      }

      const [customerServiceData, total] = await qb
        .skip((page - 1) * pageSize)
        .take(pageSize)
        .getManyAndCount();
      const totalPages = Math.ceil(total / pageSize);
      return {
        data: customerServiceData.length > 0 ? customerServiceData : [],
        total,
        totalPages,
      };
    } catch (error) {
      console.log(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async editCustomerService(requestNumber: string, dataCustomerService: EditCustomerServiceData): Promise<any> {
    const { userReceiverId, bodyReceiver, statusId } = dataCustomerService;
    const existUser = await this.userRepository.findOneBy({ id: userReceiverId });
    if (!existUser) {
      throw new ConflictException({
        code: -4,
        message: "không tìm thấy người dùng",
      });
    }
    const existCustomerService = await this.customerServiceRepository.findOneBy({ request_number: requestNumber });
    if (!existCustomerService) {
      throw new ConflictException({
        code: -4,
        message: responseMessage.notFound,
      });
    }
    const existCustomerServiceId = existCustomerService.id;

    await this.customerServiceRepository.update(
      { id: existCustomerServiceId },
      {
        user_receiver_id: userReceiverId,
        body_receiver: bodyReceiver,
        status_id: statusId,
        modified_date: new Date(),
      }
    );
    await this.customerServiceHistRepository.update({ request_id: existCustomerServiceId }, { body_receiver: bodyReceiver, status_id: statusId });
    const updateCustomerService = await this.customerServiceRepository.findOneBy({ id: existCustomerServiceId });

    const dataReturn = { ...updateCustomerService };

    return dataReturn;
  }

  async handleAddCustomerService(data: AddCustomerService): Promise<any> {
    const { userSenderId, titleSender, bodySender } = data;
    const existUser = await this.userRepository.findOneBy({ id: userSenderId });
    if (!existUser) {
      throw new ConflictException({
        code: -4,
        message: "không tìm thấy người dùng",
      });
    }
    const randomNum = Math.floor(Math.random() * 9000) + 1000;
    const requestNumber = `CS${randomNum}`;
    const customerService = this.customerServiceRepository.create({
      request_number: requestNumber,
      user_sender_id: userSenderId,
      title_sender: titleSender,
      body_sender: bodySender,
      status_id: 33,
    });
    const newCustomerService = await this.customerServiceRepository.save(customerService);

    const customerServiceHist = this.customerServiceHistRepository.create({
      request_id: newCustomerService.id,
      title_sender: titleSender,
      body_sender: bodySender,
      status_id: 33,
    });
    await this.customerServiceHistRepository.save(customerServiceHist);

    return newCustomerService;
  }
}
