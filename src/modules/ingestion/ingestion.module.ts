import { Module } from "@nestjs/common";
import { IngestionService } from "./ingestion.service";
import { ChatguruModule } from "../chatguru/chatguru.module";
import { PollingJob } from "../../jobs/polling.job";
import { IngestionController } from "./ingestion.controller";

@Module({
  imports: [ChatguruModule],

  providers: [IngestionService, PollingJob],

  exports: [IngestionService],
  controllers: [IngestionController],
})
export class IngestionModule {}
