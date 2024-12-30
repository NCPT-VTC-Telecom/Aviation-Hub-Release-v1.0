import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import helmet from "helmet";
import { ManagementPortalModule } from "./management_portal/management_portal.module";
import { ManagementCallBackModule } from "./management_callback/management_callback.module";
import * as dotenv from "dotenv";
import { LoggerService } from "./management_portal/common/logger_service/providers/log_service/log_service.service";
// import { ImportSessionService } from "./management_portal/common/tool_auto_import/providers/import_session.service";
// import { ImportFlightService } from "./management_portal/common/tool_auto_import/providers/import_flight.service";
// import { ImportDataDeviceService } from "./management_portal/common/tool_auto_import/providers/import_data_device.service";
// import { ImportSessionService } from "./management_portal/common/tool_auto_import/providers/import_session.service";
// import { BackGroundService } from "./management_portal/common/tool_auto_import/providers/import_simulator_data.service";
// import { Between } from "typeorm";

dotenv.config();

async function bootstrap() {
  const port = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule, { cors: true, logger: new LoggerService(), bufferLogs: true });

  app.useLogger(new LoggerService());

  app.use(helmet());
  app.enableCors();

  const customOptions = {
    swaggerOptions: {
      filter: true, // Enables filtering by tags
      showRequestDuration: true, // Shows the duration of requests
      defaultModelExpandDepth: 2, // Controls the depth of models displayed
      tagsSorter: "alpha", // Sorts tags alphabetically
      operationsSorter: "alpha", // Sorts operations within tags alphabetically
      defaultModelRendering: "model", // Controls how models are shown (model or schema)
      docExpansion: "none",
      deepLinking: true,
      showExtensions: true,
    },
    customCss: `
      .swagger-ui .topbar {
        background-color: #2c3e50;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .swagger-ui .topbar .topbar-wrapper img {
        display: none !important; /* Hide the original Swagger logo */
      }
      .swagger-ui .topbar .topbar-wrapper::before {
        content: '';
        display: block;
        background-image: url('https://www.vtctelecom.com.vn/images/deffiles/viLogo.png') !important;
        background-size: contain;
        background-repeat: no-repeat;
        height: 50px;
        width: 150px;
        margin-left: 20px;
      }
      .swagger-ui .topbar .topbar-wrapper span {
        color: #ffffff;
        margin-right: 20px;
      }
    `,
    customfavIcon: "./assets/favicon.ico", // Custom favicon if needed
    customSiteTitle: "VTC Aviation API Docs", // Custom site title.
  };

  const internalConfig = new DocumentBuilder()
    .setTitle("Internal API Docs")
    .setDescription("API documentation for internal usage")
    .setVersion("1.0")
    .addServer("https://wifi-aviation.vtctelecom.com.vn/api/test/vtc_aviation_wifi")
    .addServer("http://localhost:5000")
    .addBearerAuth()
    .build();

  const internalDocument = SwaggerModule.createDocument(app, internalConfig, {
    include: [ManagementPortalModule],
  });
  SwaggerModule.setup("api-docs/internal", app, internalDocument, customOptions);

  const partnerConfig = new DocumentBuilder()
    .setTitle("Partner API Docs")
    .setDescription("API documentation for partner usage")
    .setVersion("1.0")
    .addServer("https://wifi-aviation.vtctelecom.com.vn/api/test/vtc_aviation_wifi")
    .addServer("http://localhost:5000")
    .addBearerAuth()
    .build();

  const partnerDocument = SwaggerModule.createDocument(app, partnerConfig, {
    include: [ManagementCallBackModule],
  });

  SwaggerModule.setup("api-docs/partner", app, partnerDocument, customOptions);

  // const config = new DocumentBuilder().setTitle("VTC Aviation Hub").setDescription("API Aviation của VTC").setVersion("1.0").build();

  // const document = SwaggerModule.createDocument(app, config);

  // SwaggerModule.setup("api-docs", app, document, customOptions);

  // Import Background Service
  // const backgroundService = app.get(BackGroundService);
  // backgroundService.onModuleInit();

  await app.listen(port);
  // }
}
bootstrap();
