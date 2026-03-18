import { ChatguruMessageDto } from "./dto/chatguru-message.dto";

export class ChatguruMapper {
  static toEntity(dto: ChatguruMessageDto) {
    return {
      externalId: dto.id,
      chatId: dto.chatId,
      phoneNumber: dto.sender,
      sender: dto.sender,
      content: dto.text ?? "",
      timestamp: new Date(dto.timestamp),
    };
  }
}
