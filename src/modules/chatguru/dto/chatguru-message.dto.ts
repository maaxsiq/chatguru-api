import { IsString, IsDateString, IsOptional, IsBoolean } from "class-validator";

export class ChatguruMessageDto {
  @IsString()
  id: string;

  @IsString()
  chatId: string;

  @IsString()
  sender: string;

  @IsOptional()
  @IsString()
  text?: string;

  @IsBoolean()
  isFromMe: boolean;

  @IsString()
  status: string;

  @IsDateString()
  timestamp: string;

  @IsDateString()
  createdAt: string;

  @IsOptional()
  @IsString()
  type?: string;
}
