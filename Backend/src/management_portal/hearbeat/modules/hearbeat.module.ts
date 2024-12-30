/*
https://docs.nestjs.com/modules
*/

import { Module } from "@nestjs/common";
import { HearbeatController } from "../controllers/hearbeat.controller";

@Module({
  imports: [],
  controllers: [HearbeatController],
  providers: [],
})
export class HearbeatModule {}
