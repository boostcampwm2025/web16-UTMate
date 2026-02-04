import { MigrationInterface, QueryRunner } from "typeorm";

export class ReleaseV1001770193863490 implements MigrationInterface {
    name = 'ReleaseV1001770193863490'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tests\` CHANGE \`status\` \`status\` enum ('DRAFT', 'PUBLISHED', 'ARCHIVED', 'DEMO') NOT NULL DEFAULT 'DRAFT'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tests\` CHANGE \`status\` \`status\` enum ('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT'`);
    }

}
