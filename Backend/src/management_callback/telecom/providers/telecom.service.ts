import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserVerifyInformation } from "src/management_portal/user/entity/user.entity";
import { responseMessage } from "src/utils/constant";
import { Repository } from "typeorm";
import axios from "axios";
import { Products } from "src/management_portal/products/entity/product.entity";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";
import { TelecomRedeem } from "../entity/telecom.entity";
import { AircraftVNA, FlightsVietnamAirline } from "src/management_callback/vietnam_airline/entity/flight.entity";
import { VerifyPhoneNumber } from "../dto/telecom.dto";

@Injectable()
export class TelecomService {
  constructor(
    @InjectRepository(TelecomRedeem)
    private readonly telecomRedeemRepository: Repository<TelecomRedeem>,
    @InjectRepository(UserVerifyInformation)
    private readonly userVerifyInformationRepository: Repository<UserVerifyInformation>,
    @InjectRepository(FlightsVietnamAirline)
    private readonly flightRepository: Repository<FlightsVietnamAirline>,
    @InjectRepository(AircraftVNA)
    private readonly aircraftRepository: Repository<AircraftVNA>,
    @InjectRepository(Products)
    private readonly productRepository: Repository<Products>,

    private readonly logger: LoggerService
  ) {}

  async handleVerifyPhonenumber(requestData: VerifyPhoneNumber): Promise<any> {
    try {
      const userQueryBuilder = this.userVerifyInformationRepository
        .createQueryBuilder("users")
        .where("users.phone_number = :phoneNumber", { phoneNumber: requestData.phoneNumber })
        .orWhere("users.username = :username", { username: requestData.username })
        .andWhere("users.status_id NOT IN (:...statusId)", { statusId: [13, 19] });

      const userInformation = await userQueryBuilder.getOne();

      const aircraftQueryBuilder = this.aircraftRepository.createQueryBuilder("aircraft").andWhere("aircraft.flight_number = :flightNumber", { flightNumber: requestData.flightNumber }).andWhere("aircraft.status_id != :statusId", { statusId: 13 });
      const aircraftInformation = await aircraftQueryBuilder.getOne();

      const flightQueryBuilder = this.flightRepository
        .createQueryBuilder("flights")
        .where("flights.aircraft_id = :aircraftId", { aircraftId: aircraftInformation.id })
        .andWhere("flights.flight_phase NOT IN (:...flightPhases)", { flightPhases: ["Pre-departure", "Post flight"] })
        .where("flights.status_id NOT IN (:...statusId)", { statusId: [13, 19] });

      const flightInformation = await flightQueryBuilder.getOne();

      const telecomRedeemData = this.telecomRedeemRepository.find({ where: { flight_id: flightInformation.id, phone_number: requestData.phoneNumber, user_id: userInformation.id } });

      if (!userInformation || !aircraftInformation || !flightInformation || (await telecomRedeemData).length > 0) {
        return responseMessage.serviceError;
      }
      //Gọi API Viễn thông
      const url = `${process.env.TELECOM_SEVER_TEST}/validate_phone_number`;
      const phoneNumber = requestData.phoneNumber;
      const responseTelecom = await axios.post(url, { phoneNumber });
      //False => Ko cho truy cập
      if (responseTelecom.data.code !== 0) return responseMessage.notFound;
      //True => Tiến hành cho truy cập internet
      //Lưu thông tin sau khi xác thực
      const productName = responseTelecom.data.productName;
      const existProduct = this.productRepository.findOne({ where: { title: productName } });
      if (!existProduct) return responseMessage.serviceError;
      const createdTelecom = this.telecomRedeemRepository.create({
        flight_id: flightInformation.id,
        phone_number: userInformation.phone_number,
        user_id: userInformation.id,
        product_id: (await existProduct).id,
        status_id: 14,
      });

      await this.telecomRedeemRepository.save(createdTelecom);

      return responseMessage.success;
    } catch (error) {
      console.log(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async getTelecomRedeem(): Promise<any> {}
}
