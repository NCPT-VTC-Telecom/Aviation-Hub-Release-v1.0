import { Response, Request } from "express";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Controller, Get, Post, HttpStatus, Res, Req, Body, Query, UseGuards } from "@nestjs/common";
import { responseMessage } from "src/utils/constant";
import { UserService } from "src/management_portal/user/providers/user.service";
import { UserAddRequestData, UserEditRequestData, UserListRequestData } from "src/management_portal/user/interface/user.interface";
import { AddUserManagementDto, EditUserManagementDto, GetUserListManagementDto, IdUserDto } from "src/management_portal/user/dto/user.dto";
import { VerifyLoginMiddleware } from "src/management_portal/middleware/verify_user.middleware";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";
import { ChangePasswordDto } from "src/management_portal/user_auth/dto/authenticate_user.dto";
import { ChangePasswordData } from "src/management_portal/user_auth/interface/register.interface";
import { ResponseSystemService } from "src/management_portal/common/response_service/response.service";

@Controller("/v1/user_management")
@ApiTags("API quản lý thông tin người dùng")
export class UserManagmentController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: LoggerService,
    private readonly responseSystemService: ResponseSystemService
  ) {}

  @Get("/data_user")
  @ApiOperation({ summary: "Lấy danh sách người dùng cuối" })
  @ApiQuery({ type: GetUserListManagementDto })
  @ApiBearerAuth()
  @UseGuards(VerifyLoginMiddleware)
  async getUserList(@Query() filterUser: UserListRequestData, @Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      const page = filterUser.page || 0;
      const pageSize = filterUser.pageSize || 10;
      const filters = filterUser.filters || "";
      const groupId = Number(filterUser.groupId);
      if (typeof groupId !== "number") {
        await this.responseSystemService.saveAuditLog("data_user", req, "users", false);
        await this.responseSystemService.respondWithBadRequest("data_user", req, res, "users");
      }
      const users = await this.userService.findListUser(page, pageSize, filters, groupId);
      if (users.data.length == 0) {
        this.logger.log(responseMessage.notFound, req.body);
        res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.notFound, data: [] });
      } else {
        this.logger.log(responseMessage.success);
        res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.success, data: [...users.data], total: users.total, totalPages: users.totalPages });
      }
    } catch (error) {
      this.logger.error("Error in /data_user:", error);
      console.error("data_user", error);
      await this.responseSystemService.saveAuditLog("data_user", req, "users", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }

  @Post("/edit_user")
  @ApiOperation({ summary: "Chỉnh sửa thông tin người dùng cuối" })
  @ApiQuery({ type: IdUserDto })
  @ApiBody({ type: EditUserManagementDto })
  @ApiBearerAuth()
  @UseGuards(VerifyLoginMiddleware)
  async handleEditUser(@Query() idUser: IdUserDto, @Body() userData: UserEditRequestData, @Req() req: Request, @Res() res: Response): Promise<any> {
    const { id } = idUser;
    try {
      if (Object.keys(req.body).length > 0) {
        const editedUser = await this.userService.handleEditUser(id, userData);
        this.logger.log(responseMessage.success);
        await this.responseSystemService.saveAuditLog("edit_user", req, "users", editedUser);
        res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success, data: editedUser });
      } else {
        await this.responseSystemService.respondWithBadRequest("edit_user", req, res, "users");
      }
    } catch (error) {
      this.logger.error("Error in /edit_user:", error);
      console.error("edit_user", error);
      await this.responseSystemService.saveAuditLog("edit_user", req, "users", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }

  @Post("/add_user")
  @ApiOperation({ summary: "Thêm thông tin user mới" })
  @ApiBody({ type: AddUserManagementDto })
  @ApiBearerAuth()
  @UseGuards(VerifyLoginMiddleware)
  async handleAddUser(@Body() userData: UserAddRequestData, @Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      if (Object.keys(req.body).length > 0) {
        const addUser = await this.userService.handleAddUser(userData);
        this.logger.log(responseMessage.success);
        await this.responseSystemService.saveAuditLog("add_user", req, "users", addUser);

        res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success, data: addUser });
      } else {
        await this.responseSystemService.respondWithBadRequest("add_user", req, res, "users");
      }
    } catch (error) {
      this.logger.error("Error in /add_user:", error);
      console.error("add_user", error);
      await this.responseSystemService.saveAuditLog("add_user", req, "users", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }

  @Post("/delete_user")
  @ApiOperation({ summary: "Xóa thông tin user" })
  @ApiQuery({ type: IdUserDto })
  @ApiBearerAuth()
  @UseGuards(VerifyLoginMiddleware)
  async handleDeleteAircraft(@Query() idUser: IdUserDto, @Req() req: Request, @Res() res: Response): Promise<any> {
    const { id } = idUser;
    try {
      if (id) {
        const deletedUser = await this.userService.handleDeleteUser(id);
        this.logger.log(responseMessage.success);
        await this.responseSystemService.saveAuditLog("delete_user", req, "users", deletedUser);
        res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
      } else {
        await this.responseSystemService.respondWithBadRequest("delete_user", req, res, "users");
      }
    } catch (error) {
      this.logger.error("Error in /delete_user:", error);
      console.error("delete_user", error);
      await this.responseSystemService.saveAuditLog("delete_user", req, "users", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }

  @Post("/change_password")
  @ApiOperation({ summary: "Đổi password mới" })
  @ApiQuery({ type: IdUserDto })
  @ApiBody({ type: ChangePasswordDto })
  @ApiBearerAuth()
  @UseGuards(VerifyLoginMiddleware)
  async handleChangePassword(@Query() idUser: IdUserDto, @Body() changePasswordData: ChangePasswordData, @Req() req: Request, @Res() res: Response): Promise<any> {
    const { id } = idUser;
    try {
      if (Object.keys(req.body).length > 0) {
        const changePassword = await this.userService.handleChangePassword(id, changePasswordData);
        await this.responseSystemService.saveAuditLog("change_password", req, "users", changePassword);
        res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
      } else {
        await this.responseSystemService.respondWithBadRequest("change_password", req, res, "users");
      }
    } catch (error) {
      this.logger.error("Error in /change_password:", error);
      console.error("change_password", error);
      await this.responseSystemService.saveAuditLog("change_password", req, "users", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }
}
