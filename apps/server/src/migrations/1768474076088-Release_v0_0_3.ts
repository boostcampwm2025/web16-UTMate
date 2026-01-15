import { MigrationInterface, QueryRunner } from "typeorm";

export class ReleaseV0031768474076088 implements MigrationInterface {
    name = 'ReleaseV0031768474076088'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`mission_results\` (\`id\` int NOT NULL AUTO_INCREMENT, \`public_id\` varchar(21) NOT NULL, \`mission_id\` int NOT NULL, \`participant_id\` int NOT NULL, \`status\` enum ('PENDING', 'SUCCESS', 'FAILED') NOT NULL DEFAULT 'PENDING', \`duration\` int NULL, \`feedback\` text NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`filename\` varchar(255) NULL, UNIQUE INDEX \`IDX_f9a3de53586fa0ae522e6e2d81\` (\`public_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`participants\` (\`id\` int NOT NULL AUTO_INCREMENT, \`public_id\` varchar(255) NOT NULL, \`test_id\` int NOT NULL, \`user_type\` enum ('guest', 'registered') NOT NULL, \`user_id\` int NULL, \`status\` enum ('ongoing', 'completed') NOT NULL DEFAULT 'ongoing', \`feedback\` text NULL, \`joined_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE INDEX \`IDX_bd144f05d041cdcc14e564a59c\` (\`public_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`tests\` DROP FOREIGN KEY \`FK_f7c96d9683156a2e79c7b71829b\``);
        await queryRunner.query(`ALTER TABLE \`tests\` CHANGE \`owner_id\` \`owner_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`tests\` ADD CONSTRAINT \`FK_f7c96d9683156a2e79c7b71829b\` FOREIGN KEY (\`owner_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`mission_results\` ADD CONSTRAINT \`FK_2b428cbe49a6cf5e78d094409a3\` FOREIGN KEY (\`mission_id\`) REFERENCES \`missions\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`mission_results\` ADD CONSTRAINT \`FK_fe74d16fbae31a9608b3e5a732b\` FOREIGN KEY (\`participant_id\`) REFERENCES \`participants\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`participants\` ADD CONSTRAINT \`FK_440c2a57559daa6a194268b8479\` FOREIGN KEY (\`test_id\`) REFERENCES \`tests\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`participants\` ADD CONSTRAINT \`FK_1427a77e06023c250ed3794a1ba\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`participants\` DROP FOREIGN KEY \`FK_1427a77e06023c250ed3794a1ba\``);
        await queryRunner.query(`ALTER TABLE \`participants\` DROP FOREIGN KEY \`FK_440c2a57559daa6a194268b8479\``);
        await queryRunner.query(`ALTER TABLE \`mission_results\` DROP FOREIGN KEY \`FK_fe74d16fbae31a9608b3e5a732b\``);
        await queryRunner.query(`ALTER TABLE \`mission_results\` DROP FOREIGN KEY \`FK_2b428cbe49a6cf5e78d094409a3\``);
        await queryRunner.query(`ALTER TABLE \`tests\` DROP FOREIGN KEY \`FK_f7c96d9683156a2e79c7b71829b\``);
        await queryRunner.query(`ALTER TABLE \`tests\` CHANGE \`owner_id\` \`owner_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`tests\` ADD CONSTRAINT \`FK_f7c96d9683156a2e79c7b71829b\` FOREIGN KEY (\`owner_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP INDEX \`IDX_bd144f05d041cdcc14e564a59c\` ON \`participants\``);
        await queryRunner.query(`DROP TABLE \`participants\``);
        await queryRunner.query(`DROP INDEX \`IDX_f9a3de53586fa0ae522e6e2d81\` ON \`mission_results\``);
        await queryRunner.query(`DROP TABLE \`mission_results\``);
    }

}
