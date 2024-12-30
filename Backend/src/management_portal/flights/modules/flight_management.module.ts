import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { AirCraftManagmentController, FlightManagmentController } from "src/management_portal/flights/controllers/flights.controller";
import { VerifyLoginMiddleware } from "src/management_portal/middleware/verify_user.middleware";
import { FlightsEntity } from "../config/import.config";
import { FlightsProviders } from "../config/providers.config";

@Module({
  imports: [FlightsEntity],
  controllers: [FlightManagmentController, AirCraftManagmentController],
  providers: [...FlightsProviders],
  exports: [...FlightsProviders],
})
export class FlightManagementModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyLoginMiddleware).forRoutes({ path: "/v1/flight_management/*", method: RequestMethod.ALL });
  }
}
