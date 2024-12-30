import { HearbeatModule } from "./management_portal/hearbeat/modules/hearbeat.module";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as dotenv from "dotenv";

import { databaseConfig } from "./config/data.config";
import { BullModule } from "@nestjs/bull";
import { DataUsageProcessor } from "./management_portal/sessions/providers/processor_chart/data-usage.processor"; // Processor cho queue

import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigModule } from "@nestjs/config";
import { ManagementPortalModule } from "./management_portal/management_portal.module";
import { ManagementCallBackModule } from "./management_callback/management_callback.module";
import { CacheModule } from "@nestjs/cache-manager";
import { BrowsersChart, DataUsageChart, DataUsageSessionCatalog } from "./management_portal/sessions/entity/session_chart.entity";
// import { BullModule } from "@nestjs/bullmq";

dotenv.config();

@Module({
  imports: [
    HearbeatModule,
    ConfigModule.forRoot(),

    CacheModule.register({
      ttl: 60, // Cache time-to-live (TTL) in seconds (60 seconds)
      max: 100, // Maximum number of items in cache
    }),
    BullModule.forRoot({
      redis: {
        host: "localhost",
        port: 6379, // Redis port
      },
    }),
    BullModule.registerQueue({
      name: "data-usage", // Tên queue để xử lý các tác vụ
    }),

    TypeOrmModule.forRoot(databaseConfig()),
    TypeOrmModule.forFeature([DataUsageSessionCatalog, DataUsageChart, BrowsersChart]),
    ClientsModule.register([
      {
        name: "MANAGEMENT_PORTAL",
        transport: Transport.TCP,
        options: {
          host: "localhost",
          port: 5001,
        },
      },
      {
        name: "MANAGEMENT_CALLBACK",
        transport: Transport.TCP,
        options: {
          host: "localhost",
          port: 5002,
        },
      },
    ]),
    // BullModule.forRoot({
    //   connection: {
    //     host: "localhost",
    //     port: 6379,
    //   },
    // }),
    // BullModule.forRoot({
    //   connection: {
    //     host: "localhost",
    //     port: 5002,
    //   },
    // }),
    ManagementPortalModule,
    ManagementCallBackModule,
  ],
  providers: [DataUsageProcessor], // Đăng ký processor
})
export class AppModule {}
