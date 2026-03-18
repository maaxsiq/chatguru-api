import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1773852145072 implements MigrationInterface {
    name = 'Init1773852145072'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "chat" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "externalId" character varying NOT NULL, "phoneNumber" character varying NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_9d0b2ba74336710fd31154738a5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_CHAT_EXTERNAL_ID" ON "chat" ("externalId") `);
        await queryRunner.query(`CREATE INDEX "IDX_472f86020276d4bba495c0406c" ON "chat" ("phoneNumber") `);
        await queryRunner.query(`CREATE TABLE "message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "externalId" character varying NOT NULL, "chatId" character varying NOT NULL, "phoneNumber" character varying NOT NULL, "sender" character varying NOT NULL, "content" text NOT NULL, "timestamp" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_306cf6e42a75a5f0e2039af1d0" ON "message" ("externalId") `);
        await queryRunner.query(`CREATE INDEX "IDX_619bc7b78eba833d2044153bac" ON "message" ("chatId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c3510b47b8fb0768070d5f31fa" ON "message" ("phoneNumber") `);
        await queryRunner.query(`CREATE INDEX "IDX_d1bfd2ceb1ebca01e1c31f4a64" ON "message" ("phoneNumber", "timestamp") `);
        await queryRunner.query(`CREATE INDEX "IDX_65d8af2e0e9a5a14aa64d6db47" ON "message" ("chatId", "timestamp") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_65d8af2e0e9a5a14aa64d6db47"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d1bfd2ceb1ebca01e1c31f4a64"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c3510b47b8fb0768070d5f31fa"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_619bc7b78eba833d2044153bac"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_306cf6e42a75a5f0e2039af1d0"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_472f86020276d4bba495c0406c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_CHAT_EXTERNAL_ID"`);
        await queryRunner.query(`DROP TABLE "chat"`);
    }

}
