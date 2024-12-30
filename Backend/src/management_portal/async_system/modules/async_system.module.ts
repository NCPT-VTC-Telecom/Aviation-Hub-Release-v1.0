import { Module } from "@nestjs/common";
import { AsyncSystemProviders } from "../configs/providers.config";
import { AsyncSystemEntities } from "../configs/imports.config";

@Module({
  imports: [...AsyncSystemEntities],
  providers: [...AsyncSystemProviders],
  controllers: [],
})
export class AsyncSystemModule {}
