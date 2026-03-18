import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

@Entity()
export class Chat {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index("IDX_CHAT_EXTERNAL_ID", { unique: true })
  @Column({ type: "varchar" })
  externalId: string;

  @Index()
  @Column({ type: "varchar" })
  phoneNumber: string;

  @Column({ type: "varchar" })
  name: string;
}
