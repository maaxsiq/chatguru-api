import { IsString } from "class-validator";

export class ChatguruChatDto {
  @IsString()
  id: string;

  @IsString()
  phone: string;
}
