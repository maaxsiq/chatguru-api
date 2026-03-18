import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { databaseConfig } from "./config/database.config";

import { HealthModule } from "./health/health.module";
import { IngestionModule } from "./modules/ingestion/ingestion.module";
import { MessagesModule } from "./modules/messages/messages.module";
import { ChatguruModule } from "./modules/chatguru/chatguru.module";
import { AuthModule } from "./modules/auth/auth.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    AuthModule,
    ChatguruModule,
    IngestionModule,
    MessagesModule,
    HealthModule,
  ],
})
export class AppModule {}
