import { TypeOrmModule } from "@nestjs/typeorm";
import { CallBackLogRequestEntity } from "src/management_callback/callback_log/entity/callback_log.entity";
import { ApiSatelliteAAARequest } from "src/management_callback/satellite/entity/satellite.entity";
import { UserVerifyInformation } from "src/management_portal/user/entity/user.entity";
import { ProductVoucher, StatusInfo, VoucherInformation } from "../entity/service_vouchers.entity";
import { VendorInformation } from "src/management_portal/vendors/entity/vendors.entity";
import { VendorMiddleware } from "src/management_callback/common/entity/middleware.entity";

export const ServiceVoucherEntity = TypeOrmModule.forFeature([CallBackLogRequestEntity, ApiSatelliteAAARequest, VoucherInformation, ProductVoucher, UserVerifyInformation, VendorMiddleware, VendorInformation, StatusInfo]);
