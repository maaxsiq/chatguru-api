import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Message } from "src/database/entities/message.entity";

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly repo: Repository<Message>,
  ) {}

  async getMessages({
    phone,
    page,
    limit,
  }: {
    phone?: string;
    page: number;
    limit: number;
  }) {
    const skip = (page - 1) * limit;

    const where = phone ? { phoneNumber: phone } : {};

    const [data, total] = await this.repo.findAndCount({
      where,
      order: { timestamp: "DESC" },
      skip,
      take: limit,
    });

    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data,
    };
  }
}
