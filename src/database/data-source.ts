import { DataSource } from "typeorm";
import { Chat } from "./entities/chat.entity";
import { Message } from "./entities/message.entity";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL not defined");
}

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [Chat, Message],
  migrations: ["src/database/migrations/*.ts"],
  synchronize: false,
  extra: {
    max: 10,
  },
});
