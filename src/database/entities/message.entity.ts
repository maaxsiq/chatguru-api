import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from "typeorm";

@Entity()
@Index(["chatId", "timestamp"])
@Index(["phoneNumber", "timestamp"])
export class Message {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index({ unique: true })
  @Column({ type: "varchar" })
  externalId: string;

  @Index()
  @Column({ type: "varchar" })
  chatId: string;

  @Index()
  @Column({ type: "varchar" })
  phoneNumber: string;

  @Column({ type: "varchar" })
  sender: string;

  @Column("text")
  content: string;

  @Column({ type: "timestamp" })
  timestamp: Date;

  @CreateDateColumn()
  createdAt: Date;
}
