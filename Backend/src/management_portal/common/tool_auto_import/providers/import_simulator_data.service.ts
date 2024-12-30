import { Injectable } from "@nestjs/common";
import { ImportDataDeviceService } from "./import_data_device.service";
import { ImportFlightService } from "./import_flight.service";
import { ImportSessionService } from "./import_session.service";

@Injectable()
export class BackGroundService {
  constructor(
    private readonly deviceService: ImportDataDeviceService,
    private readonly flightService: ImportFlightService,
    private readonly sessionService: ImportSessionService
  ) {}

  private intervalUpdateFlightPhase = 1620000; // 27 minutes in milliseconds
  private intervalFlightCreation = 3600000; // 1 hour
  private intervalDataDevice = 360000; // 6 minutes in milliseconds
  private intervalDataSession = 360000; // 6 minutes in milliseconds

  private importSimulateDataDevice: NodeJS.Timeout;
  private importDataFlight: NodeJS.Timeout;
  private importFlightPhase: NodeJS.Timeout;
  private importDataSession: NodeJS.Timeout;

  onModuleInit() {
    this.importSimulateDataDevice = setInterval(async () => {
      try {
        await this.deviceService.importDataDevice();
        console.log("Import Data Device successfully");
      } catch (error) {
        console.error("Error Import Data Device:", error);
      }
    }, this.intervalDataDevice);

    this.importFlightPhase = setInterval(async () => {
      try {
        await this.flightService.updateFlightPhase();
        console.log("Flight phases updated successfully");
      } catch (error) {
        console.error("Error updating flight phases:", error);
      }
    }, this.intervalUpdateFlightPhase);

    this.importDataFlight = setInterval(async () => {
      try {
        await this.flightService.handleImportFlight();
        console.log("Flight called successfully");
      } catch (error) {
        console.error("Error calling FLight:", error);
      }
    }, this.intervalFlightCreation);

    this.importDataSession = setInterval(async () => {
      try {
        await this.sessionService.handleImport();
        console.log("Import Data Session successfully");
      } catch (error) {
        console.error("Error Import Data Session:", error);
      }
    }, this.intervalDataSession);
  }
}
