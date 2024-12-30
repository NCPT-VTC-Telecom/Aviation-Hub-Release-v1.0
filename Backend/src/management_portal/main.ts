import { NestFactory } from "@nestjs/core";
import { ManagementPortalModule } from "./management_portal.module";
import { Transport, MicroserviceOptions } from "@nestjs/microservices";
import { AsyncSystemService } from "./async_system/providers/async_system.service";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(ManagementPortalModule, {
    transport: Transport.TCP,
    options: {
      host: "localhost",
      port: 6052,
    },
  });

  const asyncSystemService = app.get(AsyncSystemService);

  // Schedule the service to run every 24 hours
  setInterval(
    async () => {
      await asyncSystemService.handleCheckVoucherExpire();
    },
    24 * 60 * 60 * 1000
  ); // 24 hours in milliseconds

  await app.listen();
}
bootstrap();
