import { Injectable } from "@nestjs/common";
import { ChatguruService } from "../chatguru/chatguru.service";
import { enqueueMessage } from "./ingestion.queue";
import { ChatguruMapper } from "../chatguru/chatguru.mapper";

@Injectable()
export class IngestionService {
  constructor(private chatguru: ChatguruService) {}

  async ingest() {
    const startTime = Date.now();

    console.log("📡 Starting ingestion cycle...");

    let chatsCount = 0;
    let totalProcessed = 0;
    let success = 0;
    let failed = 0;

    try {
      const chats = await this.chatguru.fetchChats();

      if (!chats.length) {
        console.log("[Ingestion] No chats found");

        return;
      }

      chatsCount = chats.length;

      console.log(`💬 Chats found: ${chatsCount}`);

      for (const chat of chats) {
        try {
          console.log(`📥 Processing chat: ${chat.id}`);

          const messages = await this.chatguru.fetchMessages(chat.id);

          if (!messages?.length) continue;

          totalProcessed += messages.length;

          const validMessages = messages.filter((msg) => {
            if (!msg?.id || !msg?.chatId || !msg?.timestamp) {
              return false;
            }

            const date = new Date(msg.timestamp);
            return !isNaN(date.getTime());
          });

          const uniqueMessages = Array.from(
            new Map(validMessages.map((m) => [m.id, m])).values(),
          );

          const BATCH_SIZE = 50;

          for (let i = 0; i < uniqueMessages.length; i += BATCH_SIZE) {
            const batch = uniqueMessages.slice(i, i + BATCH_SIZE);

            const results = await Promise.allSettled(
              batch.map(async (msg) => {
                const entity = ChatguruMapper.toEntity(msg);

                console.log("📤 Sending to queue:", {
                  externalId: entity.externalId,
                  chatId: entity.chatId,
                });

                return enqueueMessage(entity);
              }),
            );

            success += results.filter((r) => r.status === "fulfilled").length;
            failed += results.filter((r) => r.status === "rejected").length;
          }
        } catch (error) {
          console.error(`❌ Error processing chat ${chat.id}`, error);
        }
      }
    } catch (error) {
      console.error("❌ Critical ingestion error", error);
    }

    const endTime = Date.now();
    const durationMs = endTime - startTime;

    console.log(
      JSON.stringify({
        context: "ingestion",
        chats: chatsCount,
        processed: totalProcessed,
        success,
        failed,
        durationMs,
        throughputPerSecond:
          durationMs > 0 ? Math.round((totalProcessed / durationMs) * 1000) : 0,
        timestamp: new Date().toISOString(),
      }),
    );
  }
}
