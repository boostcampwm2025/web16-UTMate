import { MigrationInterface, QueryRunner } from "typeorm";

export class ReleaseV0021767889314303 implements MigrationInterface {
    name = 'ReleaseV0021767889314303'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`publicId\` varchar(21) NOT NULL, \`username\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`avatarUrl\` varchar(255) NOT NULL, \`provider\` enum ('github') NOT NULL, \`providerId\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_9099c98f00a1b5aca6b8f7f04a\` (\`publicId\`), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), UNIQUE INDEX \`IDX_ae9a93b13bce1425823c8ecd07\` (\`providerId\`, \`provider\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`missions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`publicId\` varchar(21) NOT NULL, \`order\` int NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` text NULL, \`missionUrl\` varchar(255) NOT NULL, \`estimatedDuration\` int NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`testId\` int NULL, UNIQUE INDEX \`IDX_71ab0c9d8163ea93d3f36916e9\` (\`publicId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tests\` (\`id\` int NOT NULL AUTO_INCREMENT, \`publicId\` varchar(21) NOT NULL, \`title\` varchar(255) NOT NULL, \`description\` text NULL, \`status\` enum ('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT', \`url\` varchar(255) NULL, \`sdkStatus\` tinyint NOT NULL DEFAULT 0, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`owner_id\` int NULL, UNIQUE INDEX \`IDX_85cd34fd8b2a56caf7dabbab4a\` (\`publicId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`missions\` ADD CONSTRAINT \`FK_478c67158608c73a2f2a1591b88\` FOREIGN KEY (\`testId\`) REFERENCES \`tests\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tests\` ADD CONSTRAINT \`FK_f7c96d9683156a2e79c7b71829b\` FOREIGN KEY (\`owner_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tests\` DROP FOREIGN KEY \`FK_f7c96d9683156a2e79c7b71829b\``);
        await queryRunner.query(`ALTER TABLE \`missions\` DROP FOREIGN KEY \`FK_478c67158608c73a2f2a1591b88\``);
        await queryRunner.query(`DROP INDEX \`IDX_85cd34fd8b2a56caf7dabbab4a\` ON \`tests\``);
        await queryRunner.query(`DROP TABLE \`tests\``);
        await queryRunner.query(`DROP INDEX \`IDX_71ab0c9d8163ea93d3f36916e9\` ON \`missions\``);
        await queryRunner.query(`DROP TABLE \`missions\``);
        await queryRunner.query(`DROP INDEX \`IDX_ae9a93b13bce1425823c8ecd07\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_9099c98f00a1b5aca6b8f7f04a\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}
