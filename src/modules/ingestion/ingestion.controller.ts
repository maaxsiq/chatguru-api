import { Controller, Post } from "@nestjs/common";
import { IngestionService } from "./ingestion.service";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

@ApiTags("ingestion")
@Controller("ingestion")
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post("run")
  @ApiOperation({ summary: "Trigger ingestion manually" })
  @ApiResponse({
    status: 200,
    description: "Ingestion started successfully",
  })
  async runIngestion() {
    await this.ingestionService.ingest();

    return {
      status: "ok",
      message: "Ingestion executed",
    };
  }
}
