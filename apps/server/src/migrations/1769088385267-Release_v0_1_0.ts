import { MigrationInterface, QueryRunner } from "typeorm";

export class ReleaseV0101769088385267 implements MigrationInterface {
    name = 'ReleaseV0101769088385267'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`public_id\` varchar(11) NOT NULL, \`username\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`avatarUrl\` varchar(255) NOT NULL, \`provider\` enum ('github') NOT NULL, \`providerId\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_848b8b23bf0748243d4e1e76ae\` (\`public_id\`), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), UNIQUE INDEX \`IDX_ae9a93b13bce1425823c8ecd07\` (\`providerId\`, \`provider\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`participants\` (\`id\` int NOT NULL AUTO_INCREMENT, \`public_id\` varchar(11) NOT NULL, \`test_id\` int NOT NULL, \`user_type\` enum ('GUEST', 'REGISTERED') NOT NULL, \`user_id\` int NULL, \`status\` enum ('IN_PROGRESS', 'COMPLETED') NOT NULL DEFAULT 'IN_PROGRESS', \`feedback\` text NULL, \`joined_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE INDEX \`IDX_bd144f05d041cdcc14e564a59c\` (\`public_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`mission_results\` (\`id\` int NOT NULL AUTO_INCREMENT, \`public_id\` varchar(11) NOT NULL, \`mission_id\` int NOT NULL, \`participant_id\` int NOT NULL, \`status\` enum ('PENDING', 'IN_PROGRESS', 'SUCCESS', 'FAILED') NOT NULL DEFAULT 'PENDING', \`feedback\` text NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`filename\` varchar(255) NULL, \`duration\` int NULL, \`totalIdleTime\` int NULL, \`rageClickCount\` int NULL, \`mouseThrashingCount\` int NULL, \`analysisData\` json NULL, UNIQUE INDEX \`IDX_f9a3de53586fa0ae522e6e2d81\` (\`public_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`missions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`public_id\` varchar(11) NOT NULL, \`order\` int NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` text NULL, \`missionUrl\` varchar(255) NOT NULL, \`estimatedDuration\` int NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`testId\` int NULL, UNIQUE INDEX \`IDX_5beae3c0d3cb3f443cd463dba7\` (\`public_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tests\` (\`id\` int NOT NULL AUTO_INCREMENT, \`public_id\` varchar(11) NOT NULL, \`owner_id\` int NOT NULL, \`title\` varchar(255) NOT NULL, \`description\` text NULL, \`status\` enum ('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT', \`url\` varchar(255) NULL, \`sdkStatus\` tinyint NOT NULL DEFAULT 0, \`startDate\` timestamp NULL, \`endDate\` timestamp NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, UNIQUE INDEX \`IDX_c77f7b218eb442126e0d478622\` (\`public_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`participants\` ADD CONSTRAINT \`FK_440c2a57559daa6a194268b8479\` FOREIGN KEY (\`test_id\`) REFERENCES \`tests\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`participants\` ADD CONSTRAINT \`FK_1427a77e06023c250ed3794a1ba\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`mission_results\` ADD CONSTRAINT \`FK_2b428cbe49a6cf5e78d094409a3\` FOREIGN KEY (\`mission_id\`) REFERENCES \`missions\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`mission_results\` ADD CONSTRAINT \`FK_fe74d16fbae31a9608b3e5a732b\` FOREIGN KEY (\`participant_id\`) REFERENCES \`participants\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`missions\` ADD CONSTRAINT \`FK_478c67158608c73a2f2a1591b88\` FOREIGN KEY (\`testId\`) REFERENCES \`tests\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tests\` ADD CONSTRAINT \`FK_f7c96d9683156a2e79c7b71829b\` FOREIGN KEY (\`owner_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tests\` DROP FOREIGN KEY \`FK_f7c96d9683156a2e79c7b71829b\``);
        await queryRunner.query(`ALTER TABLE \`missions\` DROP FOREIGN KEY \`FK_478c67158608c73a2f2a1591b88\``);
        await queryRunner.query(`ALTER TABLE \`mission_results\` DROP FOREIGN KEY \`FK_fe74d16fbae31a9608b3e5a732b\``);
        await queryRunner.query(`ALTER TABLE \`mission_results\` DROP FOREIGN KEY \`FK_2b428cbe49a6cf5e78d094409a3\``);
        await queryRunner.query(`ALTER TABLE \`participants\` DROP FOREIGN KEY \`FK_1427a77e06023c250ed3794a1ba\``);
        await queryRunner.query(`ALTER TABLE \`participants\` DROP FOREIGN KEY \`FK_440c2a57559daa6a194268b8479\``);
        await queryRunner.query(`DROP INDEX \`IDX_c77f7b218eb442126e0d478622\` ON \`tests\``);
        await queryRunner.query(`DROP TABLE \`tests\``);
        await queryRunner.query(`DROP INDEX \`IDX_5beae3c0d3cb3f443cd463dba7\` ON \`missions\``);
        await queryRunner.query(`DROP TABLE \`missions\``);
        await queryRunner.query(`DROP INDEX \`IDX_f9a3de53586fa0ae522e6e2d81\` ON \`mission_results\``);
        await queryRunner.query(`DROP TABLE \`mission_results\``);
        await queryRunner.query(`DROP INDEX \`IDX_bd144f05d041cdcc14e564a59c\` ON \`participants\``);
        await queryRunner.query(`DROP TABLE \`participants\``);
        await queryRunner.query(`DROP INDEX \`IDX_ae9a93b13bce1425823c8ecd07\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_848b8b23bf0748243d4e1e76ae\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}
