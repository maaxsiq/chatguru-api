import { Controller, Get, Query, BadRequestException } from "@nestjs/common";
import { MessageService } from "./messages.service";

@Controller("messages")
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  async getMessages(
    @Query("phone") phone?: string,
    @Query("page") page = "1",
    @Query("limit") limit = "20",
  ) {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      throw new BadRequestException("invalid pagination params");
    }

    return this.messageService.getMessages({
      phone,
      page: pageNumber,
      limit: limitNumber,
    });
  }
}
