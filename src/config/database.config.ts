import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Chat } from "../database/entities/chat.entity";
import { Message } from "../database/entities/message.entity";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

export const databaseConfig: TypeOrmModuleOptions = {
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [Chat, Message],
  autoLoadEntities: true,
  synchronize: false,
  logging: process.env.NODE_ENV === "development",
  ssl: false,
  extra: {
    max: 10,
  },
};
