/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, HttpStatus, Req, Res } from "@nestjs/common";
import { responseMessage } from "src/utils/constant";

@Controller("/v1/health_check")
export class HearbeatController {
  @Get("/")
  async getHearBeat(@Req() req: any, @Res() res: any): Promise<{}> {
    try {
      return res.status(HttpStatus.OK).json({
        code: 0,
        message: "Chào mừng đến VTC Aviation Hub API",
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        code: -5,
        message: responseMessage.serviceError,
      });
    }
  }
}
