# 📦 ChatGuru WhatsApp Ingestion Service

## 🚀 Overview

This project implements a **high-performance WhatsApp message ingestion service** designed to collect, process, and persist chat data from the ChatGuru platform.

Since ChatGuru does not provide a fully documented public API, this service **simulates frontend requests using session cookies**, ensuring reliable access to chat and message data.

The system is designed to:

- Capture **historical chat data (backfill)**
- Ingest **new messages with minimal delay**
- Handle **high throughput (hundreds of messages per second)**
- Persist data efficiently for querying
- Provide a **paginated API for message retrieval**

---

# 🧠 Architecture

ChatGuru Frontend API (Cookie Auth)
↓
ChatguruService
↓
IngestionService (orchestrator)
↓
BullMQ Queue
↓
Worker
↓
PostgreSQL DB
↓
REST API
↓
Swagger UI

---

# ⚙️ Tech Stack

Framework: NestJS
Language: TypeScript
Queue: BullMQ
Cache / Queue Backend: Redis
Database: PostgreSQL
HTTP Client: Axios
Documentation: Swagger
Containerization: Docker

---

# 🔐 Authentication Strategy

ChatGuru requires authentication via **session cookies**, not traditional APIs.

This service:

- Extracts and uses `session` cookie
- Simulates frontend HTTP requests
- Reproduces internal API calls

Example:

Cookie: session=YOUR_SESSION_TOKEN

---

# 🔄 Ingestion Flow

The ingestion process mirrors ChatGuru frontend behavior:

1. Fetch chats
   POST /chatlist/store

2. Iterate chats

3. Fetch messages per chat
   GET /messages2/:chatId/page/1

4. Process messages

- Validate
- Deduplicate
- Map

5. Send to queue

6. Worker persists to database

---

# ⚡ Performance Strategy

The system is optimized for high throughput:

- Queue-based ingestion (BullMQ)
- Batch processing (50 messages)
- Idempotency via externalId
- Database indexing
- Structured logs with metrics

Example metrics:

{
"processed": 1200,
"success": 1200,
"durationMs": 850,
"throughputPerSecond": 1411
}

---

# 🗄️ Data Model

Message Entity:

- id: UUID
- externalId: UNIQUE (ChatGuru ID)
- chatId: Chat reference
- phoneNumber: WhatsApp identifier
- sender: Message sender
- content: Message text
- timestamp: Message timestamp
- createdAt: Insert timestamp

---

# 🔁 Idempotency Strategy

Queue Level:
jobId = externalId

Database Level:
UNIQUE(externalId)

---

# 🌐 API Endpoints

## GET /messages

Query params:

- page
- limit
- phone

Example:

curl -X GET "http://localhost:3000/messages?page=1&limit=10&phone=101829396410589%40lid" -H "x-api-key: super-secret-key"

---

## POST /ingestion/run

Trigger ingestion manually:

curl -X POST http://localhost:3000/ingestion/run -H "x-api-key: super-secret-key"

---

## GET /health

Health check endpoint

---

# 📘 Swagger

http://localhost:3000/docs

Use:

x-api-key: super-secret-key

---

# 🐳 Running with Docker

## 1. Create docker-compose.yml

version: '3.8'

services:
postgres:
image: postgres:15
container_name: chatguru-postgres
ports:

- "5433:5432"
  environment:
  POSTGRES_USER: postgres
  POSTGRES_PASSWORD: postgres
  POSTGRES_DB: chatguru

redis:
image: redis:7
container_name: chatguru-redis
ports:

- "6379:6379"

---

## 2. Start services

docker-compose up -d

---

## 3. Install dependencies

yarn install

---

## 4. Run migrations

yarn typeorm migration:run

---

## 5. Start application

yarn start:dev

---

## 6. Start worker

npx ts-node -r dotenv/config -r tsconfig-paths/register src/modules/ingestion/ingestion.worker.ts

---

# 🧪 Testing

## Trigger ingestion

curl -X POST http://localhost:3000/ingestion/run -H "x-api-key: super-secret-key"

---

## Check database

SELECT COUNT(\*) FROM message;

---

## Query messages

curl -X GET "http://localhost:3000/messages?page=1&limit=10" -H "x-api-key: super-secret-key"

---

# 🔒 Security

- API Key authentication
- Swagger protected
- No public exposure in production

---

# 🚀 Deployment

The application is container-ready and can be deployed on:

- Ubuntu
- Docker environments
- Cloud platforms

---

# 🧠 Design Decisions

## Why Queue (BullMQ)?

- Decouples ingestion from persistence
- Handles high throughput
- Enables retries and fault tolerance

---

## Why PostgreSQL?

- Strong consistency
- Indexing for performance
- Handles large datasets efficiently

---

## Why Idempotency?

- Prevent duplicate messages
- Safe retries
- Reliable ingestion

---

# 📈 Future Improvements

- Full pagination (backfill complete history)
- Observability (Prometheus / logs)
- Parallel ingestion with concurrency control
- Message normalization

---

# 🏁 Conclusion

This system provides a **scalable, reliable, and production-ready ingestion pipeline**, capable of handling high message volumes while maintaining performance and data integrity.

---
