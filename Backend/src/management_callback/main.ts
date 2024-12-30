import { NestFactory } from "@nestjs/core";
import { Transport, MicroserviceOptions } from "@nestjs/microservices";
import { ManagementCallBackModule } from "./management_callback.module";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(ManagementCallBackModule, {
    transport: Transport.TCP,
    options: {
      host: "localhost",
      port: 6053,
    },
  });

  await app.listen();
}
bootstrap();
