import * as dotenv from "dotenv";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

dotenv.config();

export interface DatabaseConfig {
  username: string;
  password: string;
  database: string;
  type: string;
  port: number;
  host: string;
  entities: object;
  synchronize: boolean;
  options: object;
}

export const databaseConfig = (): TypeOrmModuleOptions => ({
  type: "mssql",
  host: process.env.DB_SERVER,
  port: 1433,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + "/../**/*.entity{.ts,.js}"], // Adjust path to your entities
  synchronize: false, // Set to false in production
  options: {
    encrypt: true, // Encrypt connection
    trustServerCertificate: true, // Required if using self-signed certs
  },
  extra: {
    connectionTimeout: 60000, // Connection timeout to 60 seconds
    maxRetriesPerRequest: 10, // Limit retries to avoid max retries error
    requestTimeout: 150000, // Set request timeout to 30 seconds
    pool: {
      max: 50, // Max number of connections in the pool
      min: 5, // Min number of connections
      idleTimeoutMillis: 60000, // Close idle connections after 60 seconds
      acquireTimeoutMillis: 60000, // Timeout for acquiring a connection
    },
  },
  cache: true,
});
