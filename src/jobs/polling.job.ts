import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { IngestionService } from "../modules/ingestion/ingestion.service";

@Injectable()
export class PollingJob implements OnModuleInit, OnModuleDestroy {
  private isRunning = true;

  constructor(private ingestion: IngestionService) {}

  onModuleInit() {
    this.start();
  }

  onModuleDestroy() {
    this.isRunning = false;
  }

  async start() {
    const interval = Number(process.env.POLLING_INTERVAL || 2000);

    while (this.isRunning) {
      try {
        await this.ingestion.ingest();
        console.log(`[Polling] executed at ${new Date().toISOString()}`);
      } catch (error) {
        console.error("[Polling] error", error);
      }

      await this.sleep(interval);
    }
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
