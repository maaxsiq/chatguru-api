import "dotenv/config";
import { Queue } from "bullmq";

if (!process.env.REDIS_HOST || !process.env.REDIS_PORT) {
  throw new Error("Redis config not defined");
}

const redisConnection = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),

  maxRetriesPerRequest: null,
};

console.log("📡 Queue Redis:", redisConnection);

export const ingestionQueue = new Queue("message-ingestion", {
  connection: redisConnection,

  defaultJobOptions: {
    attempts: 3,

    backoff: {
      type: "exponential",
      delay: 1000,
    },

    removeOnComplete: true,

    removeOnFail: false,
  },
});

export const enqueueMessage = async (data: {
  externalId: string;
  chatId: string;
  [key: string]: any;
}) => {
  if (!data?.externalId || !data?.chatId) {
    console.warn("⚠️ Invalid enqueue payload, skipping:", data);
    return;
  }

  try {
    await ingestionQueue.add("message", data);

    console.log("📥 Job enqueued:", data.externalId);
  } catch (error: any) {
    console.error("❌ Failed to enqueue job:", {
      externalId: data.externalId,
      error: error?.message,
    });
  }
};
