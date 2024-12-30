import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { responseMessage } from "src/utils/constant";
import { Repository } from "typeorm";
import { CallBackLogRequestEntity } from "../entity/callback_log.entity";
import { CallBackLogRequestData } from "../interface/callback_log.interface";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";
import { ApiSatelliteAAARequest } from "src/management_callback/satellite/entity/satellite.entity";
import { ApiRadiusLogRequestData } from "src/management_callback/satellite/interface/auth_radius.interface";

@Injectable()
export class RequestDataLogService {
  constructor(
    @InjectRepository(CallBackLogRequestEntity)
    private readonly apiRequestLogRepository: Repository<CallBackLogRequestEntity>,

    @InjectRepository(ApiSatelliteAAARequest)
    private readonly apiSatelliteAAARequest: Repository<ApiSatelliteAAARequest>,

    private readonly logger: LoggerService
  ) {}

  async handleAPIRequestLog(requestCallbackData: CallBackLogRequestData): Promise<any> {
    try {
      const { requestContentType, requestData, requestIpAddress, requestMethod, requestUrl, requestUserAgent, responseContent, responseIpAddress, responseStatusCode } = requestCallbackData;

      const newCallbackData = this.apiRequestLogRepository.create({
        request_content_type: requestContentType,
        request_data: requestData,
        request_ip_address: requestIpAddress,
        request_method: requestMethod,
        request_time_UTC: new Date(),
        request_url: requestUrl,
        request_user_agent: requestUserAgent,
        response_content: responseContent,
        response_ip_address: responseIpAddress,
        response_status_code: responseStatusCode,
        response_time_UTC: new Date(),
      });

      const addCallbackData = await this.apiRequestLogRepository.save(newCallbackData);
      return addCallbackData;
    } catch (error) {
      console.log(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async handleSaveAPIRequest(responseReason: string, requestData: ApiRadiusLogRequestData): Promise<any> {
    try {
      const { requestBody, requestHeaders, requestIpAddress, requestUrl, responseMessage, username } = requestData;

      const APILogInsert = this.apiSatelliteAAARequest.create({
        request_body: requestBody,
        request_headers: requestHeaders,
        request_ip_address: requestIpAddress,
        request_url: requestUrl,
        response_message: responseMessage,
        response_reason: responseReason,
        username: username,
      });

      return await this.apiSatelliteAAARequest.save(APILogInsert);
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }
}
