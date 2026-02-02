import { MigrationInterface, QueryRunner } from "typeorm";

export class ReleaseV0201769680233731 implements MigrationInterface {
    name = 'ReleaseV0201769680233731'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`missions\` DROP FOREIGN KEY \`FK_478c67158608c73a2f2a1591b88\``);
        await queryRunner.query(`ALTER TABLE \`missions\` CHANGE \`testId\` \`test_id\` int NULL`);
        await queryRunner.query(`CREATE TABLE \`personas\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` int NOT NULL, \`gender\` enum ('남성', '여성', '기타') NOT NULL, \`age_group\` enum ('10대', '20대', '30대', '40대', '50대', '60대 이상') NOT NULL, \`interests\` json NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, UNIQUE INDEX \`IDX_a5eea6c1723ca1e765836fb97b\` (\`user_id\`), UNIQUE INDEX \`REL_a5eea6c1723ca1e765836fb97b\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`test_members\` (\`test_id\` int NOT NULL, \`member_id\` int NOT NULL, INDEX \`IDX_f058ce5888af3e25e2259c532a\` (\`test_id\`), INDEX \`IDX_694eaca8ec7875735044b7a2f3\` (\`member_id\`), PRIMARY KEY (\`test_id\`, \`member_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`participants\` ADD \`ua_info\` json NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`tests\` ADD \`is_public\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`tests\` ADD \`target_genders\` json NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`tests\` ADD \`target_ages\` json NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`tests\` ADD \`target_interests\` json NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`participants\` CHANGE \`status\` \`status\` enum ('IN_PROGRESS', 'COMPLETED', 'DROP') NOT NULL DEFAULT 'IN_PROGRESS'`);
        await queryRunner.query(`ALTER TABLE \`mission_results\` CHANGE \`status\` \`status\` enum ('PENDING', 'IN_PROGRESS', 'SUCCESS', 'FAILED', 'DROP') NOT NULL DEFAULT 'PENDING'`);
        await queryRunner.query(`ALTER TABLE \`missions\` CHANGE \`test_id\` \`test_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`missions\` ADD CONSTRAINT \`FK_ab04672b86656a80de42bc6d6aa\` FOREIGN KEY (\`test_id\`) REFERENCES \`tests\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`personas\` ADD CONSTRAINT \`FK_a5eea6c1723ca1e765836fb97b7\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`test_members\` ADD CONSTRAINT \`FK_f058ce5888af3e25e2259c532ad\` FOREIGN KEY (\`test_id\`) REFERENCES \`tests\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`test_members\` ADD CONSTRAINT \`FK_694eaca8ec7875735044b7a2f3f\` FOREIGN KEY (\`member_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`test_members\` DROP FOREIGN KEY \`FK_694eaca8ec7875735044b7a2f3f\``);
        await queryRunner.query(`ALTER TABLE \`test_members\` DROP FOREIGN KEY \`FK_f058ce5888af3e25e2259c532ad\``);
        await queryRunner.query(`ALTER TABLE \`personas\` DROP FOREIGN KEY \`FK_a5eea6c1723ca1e765836fb97b7\``);
        await queryRunner.query(`ALTER TABLE \`missions\` DROP FOREIGN KEY \`FK_ab04672b86656a80de42bc6d6aa\``);
        await queryRunner.query(`ALTER TABLE \`missions\` CHANGE \`test_id\` \`test_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`mission_results\` CHANGE \`status\` \`status\` enum ('PENDING', 'IN_PROGRESS', 'SUCCESS', 'FAILED') NOT NULL DEFAULT 'PENDING'`);
        await queryRunner.query(`ALTER TABLE \`participants\` CHANGE \`status\` \`status\` enum ('IN_PROGRESS', 'COMPLETED') NOT NULL DEFAULT 'IN_PROGRESS'`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`tests\` DROP COLUMN \`target_interests\``);
        await queryRunner.query(`ALTER TABLE \`tests\` DROP COLUMN \`target_ages\``);
        await queryRunner.query(`ALTER TABLE \`tests\` DROP COLUMN \`target_genders\``);
        await queryRunner.query(`ALTER TABLE \`tests\` DROP COLUMN \`is_public\``);
        await queryRunner.query(`ALTER TABLE \`participants\` DROP COLUMN \`ua_info\``);
        await queryRunner.query(`DROP INDEX \`IDX_694eaca8ec7875735044b7a2f3\` ON \`test_members\``);
        await queryRunner.query(`DROP INDEX \`IDX_f058ce5888af3e25e2259c532a\` ON \`test_members\``);
        await queryRunner.query(`DROP TABLE \`test_members\``);
        await queryRunner.query(`DROP INDEX \`REL_a5eea6c1723ca1e765836fb97b\` ON \`personas\``);
        await queryRunner.query(`DROP INDEX \`IDX_a5eea6c1723ca1e765836fb97b\` ON \`personas\``);
        await queryRunner.query(`DROP TABLE \`personas\``);
        await queryRunner.query(`ALTER TABLE \`missions\` CHANGE \`test_id\` \`testId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`missions\` ADD CONSTRAINT \`FK_478c67158608c73a2f2a1591b88\` FOREIGN KEY (\`testId\`) REFERENCES \`tests\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
