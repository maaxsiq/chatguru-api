import { Injectable } from "@nestjs/common";
import axios from "axios";
import { ChatguruMessageDto } from "./dto/chatguru-message.dto";
import { ChatguruAuth } from "./chatguru.auth";

@Injectable()
export class ChatguruService {
  constructor(private auth: ChatguruAuth) {}

  async fetchChats(): Promise<{ id: string }[]> {
    try {
      const baseUrl = process.env.CHATGURU_BASE_URL;

      if (!baseUrl) {
        throw new Error("CHATGURU_BASE_URL missing");
      }

      const url = `${baseUrl}/chatlist/store?nocache=${Date.now()}`;

      const response = await axios.post(
        url,
        {
          page_num: 0,
          filter_order_by: "date_last_message",
          filter_new_messages: "True",
          filter_user: {
            users: [process.env.CHATGURU_USER_ID],
            groups: [],
            noDelegated: false,
          },
        },
        {
          headers: {
            ...this.auth.getHeaders(),
            "Content-Type": "application/json",
          },
          timeout: 5000,
        },
      );

      const chats = response.data?.chats ?? [];

      return chats.map((chat) => ({
        id: chat._id?.$oid,
      }));
    } catch (error) {
      console.error("[Chatguru] fetchChats error", error);
      return [];
    }
  }

  async fetchMessages(chatId: string): Promise<ChatguruMessageDto[]> {
    try {
      const baseUrl = process.env.CHATGURU_BASE_URL;

      if (!baseUrl) {
        throw new Error("CHATGURU_BASE_URL missing");
      }

      const url = `${baseUrl}/messages2/${chatId}/page/1`;

      const response = await axios.get(url, {
        headers: this.auth.getHeaders(),
        timeout: 5000,
      });

      const rawMessages = response.data?.messages_and_notes ?? [];

      return rawMessages
        .filter((item) => item.type === "message")
        .map((item) => {
          const m = item.m;

          return {
            id: m._id?.$oid,
            chatId: m.chat?.$oid,
            text: m.text,
            sender: m.wa_sender_id,
            timestamp: m.timestamp?.$date,
            createdAt: m.created?.$date,
            isFromMe: m.is_out,
            status: m.status,
          };
        });
    } catch (error) {
      console.error(`[Chatguru] fetchMessages error for chat ${chatId}`, error);
      return [];
    }
  }
}
