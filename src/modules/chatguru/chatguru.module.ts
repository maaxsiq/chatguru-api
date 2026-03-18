import { Module } from "@nestjs/common";
import { ChatguruService } from "./chatguru.service";
import { ChatguruAuth } from "./chatguru.auth";

@Module({
  providers: [ChatguruService, ChatguruAuth],
  exports: [ChatguruService],
})
export class ChatguruModule {}
