import "dotenv/config";
import { Worker, Job } from "bullmq";
import { AppDataSource } from "src/database/data-source";
import { Message } from "src/database/entities/message.entity";

if (!process.env.REDIS_HOST || !process.env.REDIS_PORT) {
  throw new Error("Redis config not defined");
}

const redisConnection = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  maxRetriesPerRequest: null,
};

console.log("📡 Worker Redis:", redisConnection);

const startWorker = async () => {
  console.log("🚀 Starting worker...");

  await AppDataSource.initialize();
  console.log("✅ Database connected");

  const repo = AppDataSource.getRepository(Message);
  console.log("📦 Repository initialized");

  const worker = new Worker(
    "message-ingestion",
    async (job: Job<Message>) => {
      console.log("🔥 JOB RECEIVED:", {
        id: job.id,
        name: job.name,
      });

      try {
        if (!job.data?.externalId || !job.data?.chatId) {
          console.warn("⚠️ Invalid job data, skipping:", job.data);
          return;
        }

        console.log("💾 Inserting message:", {
          externalId: job.data.externalId,
          chatId: job.data.chatId,
        });

        const result = await repo
          .createQueryBuilder()
          .insert()
          .into(Message)
          .values(job.data)
          .orIgnore()
          .execute();

        if (result.identifiers.length > 0) {
          console.log("✅ Insert result: INSERTED");
        } else {
          console.log("⚠️ Insert result: IGNORED (duplicate)");
        }
      } catch (error: any) {
        console.error("❌ Worker error:", {
          jobId: job.id,
          error: error?.message,
        });

        throw error;
      }
    },
    {
      connection: redisConnection,
      concurrency: 5,
    },
  );

  worker.on("ready", () => {
    console.log("🟢 Worker is ready");
  });

  worker.on("active", (job) => {
    console.log(`⚙️ Job started: ${job.id}`);
  });

  worker.on("completed", (job) => {
    console.log(`✅ Job completed: ${job.id}`);
  });

  worker.on("failed", (job, err) => {
    console.error(`❌ Job failed: ${job?.id}`, err);
  });

  worker.on("error", (err) => {
    console.error("🚨 Worker connection error:", err);
  });

  setInterval(async () => {
    try {
      const client = await worker.client;
      const keys = await client.keys("bull:*");

      console.log("🔍 Redis keys:", keys.length);
    } catch (err) {
      console.error("❌ Redis debug error:", err);
    }
  }, 5000);

  console.log("👂 Worker listening on queue: message-ingestion");
};

startWorker();
