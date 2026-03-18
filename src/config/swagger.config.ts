import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { INestApplication } from "@nestjs/common";

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle("ChatGuru Ingestion API")
    .setDescription("High performance WhatsApp message ingestion service")
    .setVersion("1.0")
    .addTag("messages")
    .addTag("health")
    .addApiKey(
      {
        type: "apiKey",
        name: "x-api-key",
        in: "header",
      },
      "api-key",
    )
    .addSecurityRequirements("api-key")
    .build();

  const document = SwaggerModule.createDocument(app, config);

  if (process.env.NODE_ENV !== "production") {
    SwaggerModule.setup("docs", app, document);
  }
}
