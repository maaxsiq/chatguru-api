import { Injectable } from "@nestjs/common";

@Injectable()
export class ChatguruAuth {
  getHeaders() {
    const token = process.env.CHATGURU_SESSION_TOKEN;
    const apiKey = process.env.CHATGURU_API_KEY;
    const baseUrl = process.env.CHATGURU_BASE_URL;

    if (!token) {
      throw new Error("ChatGuru session token not configured");
    }

    return {
      Cookie: `session=${token}`,
      Accept: "application/json",
      "User-Agent": "Mozilla/5.0",
      Referer: `${baseUrl}/chats`,
      "Accept-Language": "pt-BR,pt;q=0.9",
      ...(apiKey && { "x-api-key": apiKey }),
    };
  }
}
