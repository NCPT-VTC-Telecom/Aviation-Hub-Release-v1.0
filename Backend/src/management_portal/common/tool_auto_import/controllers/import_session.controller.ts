import { Controller, Get } from "@nestjs/common";
import { ImportSessionService } from "src/management_portal/common/tool_auto_import/providers/import_session.service";

@Controller("/data")
export class DataController {
  constructor(private readonly importSessionService: ImportSessionService) {}

  @Get("/random")
  async getRandomData() {
    return await this.importSessionService.handleImport();
  }
}
