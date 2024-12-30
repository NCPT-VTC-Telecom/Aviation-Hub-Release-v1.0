import { Injectable, InternalServerErrorException, StreamableFile } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Aircraft } from "src/management_portal/flights/entity/aircraft.entity";
import { DeviceDetails, Devices, DeviceType } from "src/management_portal/devices/entity/devices.entity";
import { Gateways } from "src/management_portal/gateways/entity/gateway.entity";
import { ProductPrice, Products } from "src/management_portal/products/entity/product.entity";
import { Supplier } from "src/management_portal/supplier/entity/supplier.entity";
import { responseMessage } from "src/utils/constant";
import { Repository } from "typeorm";
import { LoggerService } from "../../logger_service/providers/log_service/log_service.service";
import { AddUserInformation, UserInformation } from "src/management_portal/user/entity/user.entity";
import * as XLSX from "xlsx";
import { UserGroup } from "src/management_portal/user_group/entity/user_group.entity";
import { SaleChannels } from "src/management_portal/sale_channels/entity/sale_channels.entity";
import * as bcrypt from "bcrypt";

@Injectable()
export class ExcelService {
  constructor(
    @InjectRepository(Aircraft)
    private readonly aircraftRepository: Repository<Aircraft>,
    @InjectRepository(Devices)
    private readonly deviceRepository: Repository<Devices>,
    @InjectRepository(DeviceDetails)
    private readonly deviceDetailsRepository: Repository<DeviceDetails>,
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
    @InjectRepository(Products)
    private readonly productRepository: Repository<Products>,
    @InjectRepository(ProductPrice)
    private readonly productPriceRepository: Repository<ProductPrice>,
    @InjectRepository(Gateways)
    private readonly gatewayRepository: Repository<Gateways>,
    @InjectRepository(SaleChannels)
    private readonly saleChannelsRepository: Repository<SaleChannels>,
    @InjectRepository(UserInformation)
    private readonly userRepository: Repository<UserInformation>,
    @InjectRepository(UserGroup)
    private readonly userGroupRepository: Repository<UserGroup>,
    @InjectRepository(DeviceType)
    private readonly deviceTypeRepository: Repository<DeviceType>,
    @InjectRepository(AddUserInformation)
    private readonly addUserInformationRepository: Repository<AddUserInformation>,
    private readonly logger: LoggerService
  ) {}

  async handleImportExcel(type: string, dataImport: any[]): Promise<any> {
    try {
      switch (type) {
        case "aircraft": {
          const formatDataAircraft = dataImport.map((item) => {
            const newData: any = {
              flight_number: item.flightNumber || null,
              tail_number: item.tailNumber || null,
              model: item.model || null,
              manufacturer: item.manufacturer || null,
              model_type: item.modelType || null,
              capacity: item.capacity || null,
              leased_aircraft_status: item.leasedAircraftStatus || null,
              year_manufactured: item.yearManufactured || null,
              ownership: item.ownership || null,
              status_id: 14,
            };
            return newData;
          });
          for (const record of formatDataAircraft) {
            const entity = this.aircraftRepository.create(record);
            await this.aircraftRepository.save(entity);
          }
          return formatDataAircraft;
        }

        case "device": {
          const formatDataDevice = dataImport.map((item) => {
            const typeId = this.getIdTypeDevice(item.type);
            const newData: any = {
              type_id: typeId || null,
              aircraft_id: item.aircraftId || null,
              name: item.name || null,
              description: item.description || null,
              date_of_manufacture: item.dateOfManufacture || null,
              placement_location: item.placementLocation || null,
              activation_date: item.activationDate || null,
              deactivation_date: item.deactivationDate || null,
              status_id: 14,
            };
            return newData;
          });
          for (const record of formatDataDevice) {
            const entity = this.deviceRepository.create(record);
            await this.deviceRepository.save(entity);
          }
          return formatDataDevice;
        }
        case "supplier": {
          const formatDataSupplier = dataImport.map((item) => {
            const newData: any = {
              name: item.name || null,
              description: item.description || null,
              address: item.address || null,
              contact: item.contract || null,
              type: item.type || null,
              status_id: item.status == "active" ? 14 : 19,
            };
            return newData;
          });
          for (const record of formatDataSupplier) {
            const entity = this.supplierRepository.create(record);
            await this.supplierRepository.save(entity);
          }
          return formatDataSupplier;
        }

        case "product": {
          const formatDataProduct = dataImport.map((item) => {
            const newDataProduct: any = {
              image_link: item.imageLink,
              title: item.title,
              description: item.description,
              type: item.type,
              total_time: item.totalTime,
              bandwidth_upload: item.bandwidthUpload,
              bandwidth_download: item.bandwidthDownload,
              data_total: item.dataTotal,
              data_upload: item.dataUpload,
              data_download: item.dataDownload,
              status_id: 14,
            };
            return newDataProduct;
          });
          const formatDataProductPrice = dataImport.map((item) => {
            const dataPrice = item.dataPrice;
            const newProductPrice: any = {
              original_price: dataPrice.originalPrice,
              new_price: dataPrice.newPrice,
              currency: dataPrice.currency,
              start_date: dataPrice.startDate,
              end_date: dataPrice.endDate,
              status_id: 14,
              created_by: 1,
            };
            return newProductPrice;
          });
          for (const record of formatDataProduct) {
            const entity = this.productRepository.create(record);
            await this.productRepository.save(entity);
          }
          for (const record of formatDataProductPrice) {
            const entity = this.productPriceRepository.create(record);
            await this.productPriceRepository.save(entity);
          }
          return formatDataProduct;
        }

        case "sale_channels": {
          const formatDataSaleChannels = dataImport.map((item) => {
            const newData: any = {
              title: item.title,
              description: item.description,
              code: item.code,
              value: item.value,
              status_id: 14,
            };
            return newData;
          });
          for (const record of formatDataSaleChannels) {
            const entity = this.saleChannelsRepository.create(record);
            await this.saleChannelsRepository.save(entity);
          }
          return formatDataSaleChannels;
        }

        case "gateway": {
          const formatDataGateway = dataImport.map((item) => {
            const newData: any = {
              title: item.title,
              description: item.description,
              code: item.code,
              value: item.value,
              status_id: 14,
            };
            return newData;
          });
          for (const record of formatDataGateway) {
            const entity = this.gatewayRepository.create(record);
            await this.gatewayRepository.save(entity);
          }
          return formatDataGateway;
        }

        case "user": {
          const formatDataUser = dataImport.map((item) => {
            const newData: any = {
              fullname: item.fullname,
              address: item.address,
              citizen_id: item.citizenId,
              country: item.country,
              district: item.district,
              email: item.email,
              gender: item.gender,
              phone_number: item.phoneNumber,
              postcode: item.postcode,
              province: item.province,
              ward: item.ward,
              username: item.username,
              status_id: 14,
              user_group: item.userGroupId,
            };
            return newData;
          });

          for (const record of formatDataUser) {
            const entity = await this.addUserInformationRepository.create({
              fullname: record.fullname,
              address: record.address,
              citizen_id: record.citizen_id,
              country: record.country,
              district: record.district,
              email: record.email,
              gender: record.gender,
              phone_number: record.phone_number,
              postcode: record.postcode,
              province: record.province,
              ward: record.ward,
              username: record.username,
              password: record.password,
              status_id: 14,
              // user_group: record.user_group,
            });
            const newUser = await this.addUserInformationRepository.save(entity);

            const newUserGroup = await this.userGroupRepository.create({ user_id: newUser.id, group_id: record.user_group });
            await this.userGroupRepository.save(newUserGroup);
          }
          return formatDataUser;
        }
      }
    } catch (error) {
      console.log(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async getIdTypeDevice(type: string) {
    const existDeviceType = await this.deviceTypeRepository.findOne({ where: { name: type } });
    const idType = existDeviceType.id;
    return idType;
  }

  async getNameTypeDevice(id: number) {
    const existDeviceType = await this.deviceTypeRepository.findOne({ where: { id: id } });
    const nameType = existDeviceType.name;
    return nameType;
  }

  async handleExportExcel(type: string, typeSupplier: string, groupId: number, typeProduct: string) {
    try {
      // tạo workbook
      const workbook = XLSX.utils.book_new();
      let title;
      let excelHeader;
      let dataExport;

      switch (type) {
        case "aircraft": {
          const queryAircraft = this.aircraftRepository.createQueryBuilder("aircraft").where("aircraft.status_id != :statusId", { statusId: 13 });
          const [dataAircraft, countAircraft] = await queryAircraft.getManyAndCount();
          const formatDataAircraft = await dataAircraft.map((item, index) => {
            const dataReturn = {
              condenserNumber: index + 1,
              flightNumber: item.flight_number,
              tailNumber: item.tail_number,
              model: item.model,
              modelType: item.model_type,
              manufacturer: item.manufacturer,
              yearManufacturer: item.year_manufactured,
              capacity: item.capacity,
              lessAircraftStatus: item.leased_aircraft_status,
              ownership: item.ownership,
            };
            return dataReturn;
          });
          const arrayToArrayDataAircraft = formatDataAircraft.map((obj) => Object.values(obj));
          excelHeader = ["STT", "Số chuyến bay", "Số hiệu máy bay", "Model", "Loại máy bay", "Lịch bảo trì", "Ngày bảo trì gần nhất", "Nhà sản xuất", "Năm sản xuất", "Loại hợp đồng", "Đơn vị sỡ hữu"];
          title = "BẢNG BÁO CÁO THÔNG TIN MÁY BAY";
          dataExport = arrayToArrayDataAircraft;
          break;
        }

        case "device": {
          const queryDevice = this.deviceDetailsRepository
            .createQueryBuilder("device_details")
            .leftJoinAndSelect("device_details.devices", "devices")
            .leftJoinAndSelect("devices.type", "device_type")
            .leftJoinAndSelect("devices.aircraft", "aircraft")
            .leftJoinAndSelect("devices.status_description", "status")
            .where("devices.status_id != :statusId", { statusId: 13 });
          const [dataDevice, countDevice] = await queryDevice.getManyAndCount();
          const formatDataDevice = await dataDevice.map((device, index) => {
            const dataReturn = {
              condenserNumber: index + 1,
              name: device.devices.name,
              type: device.devices.type.name,
              model: device.model,
              firmware: device.firmware,
              wifi_standard: device.wifi_standard,
              mac_address: device.mac_address,
              tailNumber: device.devices.aircraft.tail_number,
              placement_location: device.devices.placement_location,
              supplier: device.supplier,
              activation_date: device.devices.activation_date,
              deactivation_date: device.devices.deactivation_date,
            };
            return dataReturn;
          });
          const arrayToArrayDataDevice = formatDataDevice.map((obj) => Object.values(obj));
          excelHeader = ["STT", "Tên thiết bị", "Loại", "Model", "Firmware", "Chuẩn Wifi", "Địa chỉ MAC", "Số hiệu máy bay", "Vị trí lắp đặt", "Tên nhà cung cấp", "Ngày kích hoạt", "Ngày kết thúc hoạt động"];
          title = "BẢNG BÁO CÁO THÔNG TIN THIẾT BỊ";
          dataExport = arrayToArrayDataDevice;
          break;
        }

        case "supplier": {
          const querySupplier = this.supplierRepository.createQueryBuilder("supplier").where("supplier.status_id != :statusId", { statusId: 13 }).andWhere("supplier.type = :typeSupplier", { typeSupplier: typeSupplier });
          const [dataSupplier, countSupplier] = await querySupplier.getManyAndCount();
          const formatDataSupplier = dataSupplier.map((supplier, index) => {
            const dataReturn = {
              condenserNumber: index + 1,
              name: supplier.name,
              address: supplier.address,
              contact: supplier.contact,
              description: supplier.description,
            };
            return dataReturn;
          });
          const arrayToArrayDataSupplier = formatDataSupplier.map((obj) => Object.values(obj));
          excelHeader = ["STT", "Tên nhà cung cấp", "Địa chỉ", "Thông tin liên hệ", "Mô tả"];
          title = "BẢNG BÁO CÁO THÔNG TIN NHÀ CUNG CẤP";
          dataExport = arrayToArrayDataSupplier;
          break;
        }

        case "product": {
          const queryProduct = this.productRepository
            .createQueryBuilder("products")
            .leftJoinAndSelect("products.price", "ProductPrice")
            .where("products.type = :typeProduct", { typeProduct: typeProduct })
            .andWhere("products.status_id != :statusId", { statusId: 13 });
          const [dataProduct, countProduct] = await queryProduct.getManyAndCount();
          const formatDataProduct = dataProduct.map((product, index) => {
            const dataReturn = {
              condenserNumber: index + 1,
              title: product.title,
              type: product.type,
              total_time: product.total_time,
              bandwidth_download: product.bandwidth_download,
              bandwidth_upload: product.bandwidth_upload,
              data_total: product.data_total,
              price: product.price.new_price,
            };
            return dataReturn;
          });
          const arrayToArrayDataProduct = formatDataProduct.map((obj) => Object.values(obj));
          excelHeader = ["STT", "Tên gói cước", "Loại", "Tổng thời gian truy cập", "Băng thông tải xuống", "Băng thông tải lên", "Tổng dung lượng truy cập", "Mô tả", " Giá"];
          title = "BẢNG BÁO CÁO DANH SÁCH GÓI CƯỚC";
          dataExport = arrayToArrayDataProduct;
          break;
        }

        case "sale_channels": {
          const querySaleChannels = this.saleChannelsRepository.createQueryBuilder("sale_channels").where("sale_channels.status_id != :statusId", { statusId: 13 });
          const [dataSaleChannels, countSaleChannels] = await querySaleChannels.getManyAndCount();
          const formatDataSaleChannels = dataSaleChannels.map((saleChannels, index) => {
            const dataReturn = {
              condenserNumber: index + 1,
              code: saleChannels.code,
              title: saleChannels.title,
              value: saleChannels.value,
              description: saleChannels.description,
            };
            return dataReturn;
          });
          const arrayToArrayDataSaleChannels = formatDataSaleChannels.map((obj) => Object.values(obj));
          excelHeader = ["STT", "Code", "Tên kênh bán hàng", "Tham số dịch vụ", "Mô tả"];
          title = "BẢNG BÁO CÁO DANH SÁCH KÊNH BÁN HÀNG";
          dataExport = arrayToArrayDataSaleChannels;
          break;
        }

        case "gateway": {
          const queryGateway = this.gatewayRepository.createQueryBuilder("gateways").where("gateways.status_id != :statusId", { statusId: 13 });

          const [dataGateway, countGateway] = await queryGateway.getManyAndCount();
          const formatDataGateway = dataGateway.map((gateway, index) => {
            const dataReturn = {
              condenserNumber: index + 1,
              code: gateway.code,
              title: gateway.title,
              value: gateway.value,
              description: gateway.description,
            };
            return dataReturn;
          });
          const arrayToArrayDataGateway = formatDataGateway.map((obj) => Object.values(obj));
          excelHeader = ["STT", "Code", "Tên phương thức thanh toán", "Tham số dịch vụ", "Mô tả"];
          title = "BẢNG BÁO CÁO DANH SÁCH CỔNG THANH TOÁN";
          dataExport = arrayToArrayDataGateway;
          break;
        }
        case "user": {
          const queryUser = this.userRepository.createQueryBuilder("users").where("users.status_id != :statusId", { statusId: 13 }).leftJoinAndSelect("users.user_group", "user_group").andWhere("user_group.group_id = :groupId ", { groupId });

          const [dataUser, countUser] = await queryUser.getManyAndCount();

          const formatDataUser = dataUser.map((user, index) => {
            const dataReturn = {
              condenserNumber: index + 1,
              fullname: user.fullname,
              username: user.username,
              phone_number: user.phone_number,
              gender: user.gender,
              district: user.district,
              province: user.province,
              country: user.country,
            };
            return dataReturn;
          });
          const arrayToArrayDataUser = formatDataUser.map((obj) => Object.values(obj));

          excelHeader = ["STT", "Tên người dùng", "Tên tài khoản", "Số điện thoại", "Giới tính", "Quận / Huyện", "Thành phố / Tỉnh", "Quốc gia"];
          title = "BẢNG BÁO CÁO DANH SÁCH NGƯỜI DÙNG";
          dataExport = arrayToArrayDataUser;
          break;
        }
      }

      // 1. Tạo worksheet và đổ data
      const worksheet = XLSX.utils.aoa_to_sheet([]);
      XLSX.utils.sheet_add_aoa(worksheet, dataExport, { origin: "A4" });

      // 2. Thêm tiêu đề (title) vào các ô B1-G1
      const cellRange = ["B1", "C1", "D1", "E1", "F1", "G1"];

      cellRange.forEach((cell) => {
        worksheet[cell] = {
          v: title,
          s: {
            font: { bold: true },
            alignment: { horizontal: "center", vertical: "center" },
          },
        };
      });

      // Gộp các ô từ B1 đến G1
      worksheet["!merges"] = [{ s: { r: 0, c: 1 }, e: { r: 0, c: 6 } }];

      // 3. Thêm header vào từ dòng A3
      XLSX.utils.sheet_add_aoa(worksheet, [excelHeader], { origin: "A3" });

      // 4. Thêm worksheet vào workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, `${type}`);

      // 5. Ghi file
      const excelBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
      return new StreamableFile(excelBuffer);
    } catch (error) {
      console.log(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }
  async handleExportExcelBlank(type: string) {
    try {
      // tạo workbook
      const workbook = XLSX.utils.book_new();
      let title;
      let excelHeader;

      switch (type) {
        case "aircraft":
          excelHeader = ["STT", "Số chuyến bay", "Số hiệu máy bay", "Model", "Loại máy bay", "Lịch bảo trì", "Ngày bảo trì gần nhất", "Nhà sản xuất", "Năm sản xuất", "Loại hợp đồng", "Đơn vị sỡ hữu"];
          title = "BẢNG BÁO CÁO THÔNG TIN MÁY BAY";
          break;

        case "device":
          excelHeader = ["STT", "Tên thiết bị", "Loại", "Model", "Firmware", "Chuẩn Wifi", "Địa chỉ MAC", "Số hiệu máy bay", "Vị trí lắp đặt", "Tên nhà cung cấp", "Ngày kích hoạt", "Ngày kết thúc hoạt động"];
          title = "BẢNG BÁO CÁO THÔNG TIN THIẾT BỊ";
          break;

        case "supplier":
          excelHeader = ["STT", "Tên nhà cung cấp", "Địa chỉ", "Thông tin liên hệ", "Mô tả"];
          title = "BẢNG BÁO CÁO THÔNG TIN NHÀ CUNG CẤP";
          break;

        case "product":
          excelHeader = ["STT", "Tên gói cước", "Loại", "Tổng thời gian truy cập", "Băng thông tải xuống", "Băng thông tải lên", "Tổng dung lượng truy cập", "Mô tả", " Giá"];
          title = "BẢNG BÁO CÁO DANH SÁCH GÓI CƯỚC";
          break;

        case "sale_channels":
          excelHeader = ["STT", "Code", "Tên kênh bán hàng", "Tham số dịch vụ", "Mô tả"];
          title = "BẢNG BÁO CÁO KÊNH BÁN HÀNG";
          break;

        case "gateway":
          excelHeader = ["STT", "Code", "Tên phương thức thanh toán", "Tham số dịch vụ", "Mô tả"];
          title = "BẢNG BÁO CÁO DANH SÁCH CỔNG THANH TOÁN";
          break;

        case "user":
          excelHeader = ["STT", "Tên người dùng", "Tên tài khoản", "Số điện thoại", "Giới tính", "Quận / Huyện", "Thành phố / Tỉnh", "Quốc gia"];
          title = "BẢNG BÁO CÁO DANH SÁCH NGƯỜI DÙNG";
          break;
      }

      // 1. Tạo worksheet và đổ data
      const worksheet = XLSX.utils.aoa_to_sheet([]);
      // XLSX.utils.sheet_add_aoa(worksheet, dataExport, { origin: "A4" });

      // 2. Thêm tiêu đề (title) vào các ô B1-G1
      const cellRange = ["B1", "C1", "D1", "E1", "F1", "G1"];

      cellRange.forEach((cell) => {
        worksheet[cell] = {
          v: title,
          s: {
            font: { bold: true },
            alignment: { horizontal: "center", vertical: "center" },
          },
        };
      });

      // Gộp các ô từ B1 đến G1
      worksheet["!merges"] = [{ s: { r: 0, c: 1 }, e: { r: 0, c: 6 } }];

      // 3. Thêm header vào từ dòng A3
      XLSX.utils.sheet_add_aoa(worksheet, [excelHeader], { origin: "A3" });

      // 4. Thêm worksheet vào workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, `${type}`);

      // 5. Ghi file
      const excelBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
      return new StreamableFile(excelBuffer);
    } catch (error) {
      console.log(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }
}
