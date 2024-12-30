import { Response, Request } from "express";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Controller, Get, Post, HttpStatus, Res, Req, Body, Query, UseGuards } from "@nestjs/common";
import { responseMessage } from "src/utils/constant";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";
import { AddGroupRoleDto, GetUserGroupManagementDto, IdUserGroupDto } from "src/management_portal/user_group/dto/user_group.dto";
import { VerifyLoginMiddleware } from "src/management_portal/middleware/verify_user.middleware";
import { GroupRoleListRequestData, UserGroupListRequestData } from "src/management_portal/user_group/interface/user_group.interface";
import { UserGroupService } from "src/management_portal/user_group/providers/user_group.service";
import { ResponseSystemService } from "src/management_portal/common/response_service/response.service";

@Controller("/v1/role_management")
@ApiTags("API quản lý thông tin phân quyền")
export class UserGroupManagmentController {
  constructor(
    private readonly logger: LoggerService,
    private readonly groupService: UserGroupService,
    private readonly responseSystemService: ResponseSystemService
  ) {}

  @Get("/data_role")
  @ApiOperation({ summary: "Lấy danh sách người dùng cuối" })
  @ApiQuery({ type: GetUserGroupManagementDto })
  @ApiBearerAuth()
  @UseGuards(VerifyLoginMiddleware)
  async getListRole(@Query() requestGroupData: UserGroupListRequestData, @Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      const page = requestGroupData.page || 0;
      const pageSize = requestGroupData.pageSize || 10;
      const filters = requestGroupData.filters || "";
      const level = requestGroupData?.level;
      const parentId = requestGroupData?.parentId != undefined ? JSON.parse(requestGroupData?.parentId) : [];

      if (level) {
        const userGroup = await this.groupService.findListGroup(page, pageSize, filters, level, parentId);
        if (userGroup.data.length == 0) {
          this.logger.log(responseMessage.notFound, req.body);
          res.status(HttpStatus.OK).send({ code: -4, message: responseMessage.notFound, data: [] });
        } else {
          this.logger.log(responseMessage.success);
          res.status(HttpStatus.OK).send({ code: 0, message: responseMessage.success, data: [...userGroup.data], total: userGroup?.total, totalPages: userGroup?.totalPages });
        }
      } else {
        await this.responseSystemService.respondWithBadRequest("data_role", req, res, "group_roles");
      }
    } catch (error) {
      this.logger.error("Error in /data_role:", error);
      console.error("data_role", error);
      await this.responseSystemService.saveAuditLog("data_role", req, "group_roles", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }

  @Post("/add_role")
  @ApiOperation({ summary: "Thêm vai trò mới" })
  @ApiBody({ type: AddGroupRoleDto })
  @ApiBearerAuth()
  @UseGuards(VerifyLoginMiddleware)
  async handleAddRole(@Body() roleData: GroupRoleListRequestData, @Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      if (Object.keys(req.body).length > 0) {
        const addedRole = await this.groupService.addGroupRole(roleData);
        this.logger.log(responseMessage.success);
        await this.responseSystemService.saveAuditLog("add_role", req, "group_roles", addedRole);

        res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success, data: addedRole });
      } else {
        await this.responseSystemService.respondWithBadRequest("add_role", req, res, "group_roles");
      }
    } catch (error) {
      this.logger.error("Error in /add_role:", error);
      console.error("add_role", error);
      await this.responseSystemService.saveAuditLog("add_role", req, "group_roles", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }

  @Post("/edit_role")
  @ApiOperation({ summary: "Thay đổi thông tin vai trò" })
  @ApiQuery({ type: IdUserGroupDto })
  @ApiBody({ type: AddGroupRoleDto })
  @UseGuards(VerifyLoginMiddleware)
  @ApiBearerAuth()
  async handleEditGroupRole(@Query() idUserGroup: IdUserGroupDto, @Body() roleData: AddGroupRoleDto, @Req() req: Request, @Res() res: Response): Promise<any> {
    const { id } = idUserGroup;
    try {
      if (Object.keys(req.body).length > 0) {
        const editedRole = await this.groupService.handleEditGroupRole(id, roleData);
        this.logger.log(responseMessage.success);
        await this.responseSystemService.saveAuditLog("edit_role", req, "group_roles", editedRole);
        res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
      } else {
        await this.responseSystemService.respondWithBadRequest("edit_role", req, res, "group_roles");
      }
    } catch (error) {
      this.logger.error("Error in /edit_role:", error);
      console.error("edit_role", error);
      await this.responseSystemService.saveAuditLog("add_role", req, "group_roles", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }

  @Post("/delete_role")
  @ApiOperation({ summary: "Vô hiệu hóa vai trò" })
  @ApiQuery({ type: IdUserGroupDto })
  @UseGuards(VerifyLoginMiddleware)
  @ApiBearerAuth()
  async handleDeleteGroupRole(@Query() idUserGroup: IdUserGroupDto, @Req() req: Request, @Res() res: Response): Promise<any> {
    const { id } = idUserGroup;
    try {
      if (id) {
        const deletedRole = await this.groupService.handleDeleteGroupRole(id);
        this.logger.log(responseMessage.success);
        await this.responseSystemService.saveAuditLog("delete_role", req, "group_roles", deletedRole);
        res.status(HttpStatus.OK).json({ code: 0, message: responseMessage.success });
      } else {
        await this.responseSystemService.respondWithBadRequest("delete_role", req, res, "group_roles");
      }
    } catch (error) {
      this.logger.error("Error in /delete_role:", error);
      console.error("delete_role", error);
      await this.responseSystemService.saveAuditLog("delete_role", req, "group_roles", error, false);
      return await this.responseSystemService.handleError(res, error);
    }
  }
}
