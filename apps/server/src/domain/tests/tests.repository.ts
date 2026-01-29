import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, EntityManager, ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';

import { SearchTestQueryDto } from './dto/search-test.dto';
import { Test, TestStatus } from './entities/test.entity';

@Injectable()
export class TestsRepository {
  constructor(@InjectRepository(Test) private readonly testsRepository: Repository<Test>) {}

  /*----------- CUD -----------*/

  save(test: Test, manager?: EntityManager): Promise<Test> {
    return this.getRepo(manager).save(test);
  }

  remove(test: Test, manager?: EntityManager) {
    return this.getRepo(manager).remove(test);
  }

  async updateSdkStatus(publicId: string, sdkStatus: boolean, manager?: EntityManager) {
    const result = await this.getRepo(manager)
      .createQueryBuilder()
      .update(Test)
      .set({ sdkStatus })
      .where('publicId = :publicId', { publicId })
      .execute();

    return result.affected || 0;
  }

  /*----------- 조회 메서드 (비권한 체크) -----------*/

  /**
   * 공개 ID로 테스트를 조회합니다.
   * Missions, Members에 대한 정보도 함께 조회합니다.
   *
   * @param publicId 테스트 공개 ID
   * @param manager EntityManager (Optional)
   * @returns Promise<Test | undefined>
   */
  findByPublicIdWithMembers(publicId: string, manager?: EntityManager) {
    return this.getRepo(manager)
      .createQueryBuilder('tests')
      .leftJoinAndSelect('tests.owner', 'owner')
      .leftJoinAndSelect('tests.members', 'members')
      .leftJoinAndSelect('tests.missions', 'missions')
      .where('tests.publicId = :publicId', { publicId })
      .getOne();
  }

  /**
   * 공개 ID로 테스트를 조회합니다.
   * Missions에 대한 정보도 함께 조회합니다.
   *
   * @param publicId 테스트 공개 ID
   * @param manager EntityManager (Optional)
   * @returns Promise<Test | undefined>
   */
  findByPublicIdWithMissions(publicId: string, manager?: EntityManager) {
    return this.getRepo(manager)
      .createQueryBuilder('tests')
      .leftJoinAndSelect('tests.missions', 'missions')
      .where('tests.publicId = :publicId', { publicId })
      .getOne();
  }

  searchTestsByQuery(query: SearchTestQueryDto, manager?: EntityManager) {
    const queryBuilder = this.getRepo(manager)
      .createQueryBuilder('tests')
      .where('tests.status = :status', { status: TestStatus.PUBLISHED })
      .andWhere('tests.isPublic = :isPublic', { isPublic: true });

    if (query.gender) {
      queryBuilder.andWhere(':gender MEMBER OF (tests.target_genders)', { gender: query.gender });
    }

    if (query.age) {
      queryBuilder.andWhere(':age MEMBER OF (tests.target_ages)', {
        age: query.age,
      });
    }

    if (query.interests && query.interests.length > 0) {
      queryBuilder.andWhere('JSON_OVERLAPS(tests.target_interests, :interests)', {
        interests: JSON.stringify(query.interests),
      });
    }

    return queryBuilder
      .skip((query.page - 1) * query.limit)
      .take(query.limit)
      .orderBy('tests.createdAt', 'DESC')
      .getManyAndCount();
  }

  /*----------- 조회 메서드 (권한 체크) -----------*/

  /**
   * 사용자 ID로 접근 가능한 모든 테스트를 조회합니다.
   *
   * @param userId 사용자 ID
   * @param manager EntityManager (Optional)
   * @returns Promise<Test[]>
   */
  findByUserIdWithUsers(userId: number, manager?: EntityManager) {
    return this.createAccessibleQuery(userId, manager)
      .leftJoinAndSelect('tests.owner', 'owner')
      .leftJoinAndSelect('tests.members', 'members')
      .getMany();
  }

  /**
   * 공개 ID와 사용자 ID로 테스트를 조회합니다.
   * 사용자 ID를 기반으로 접근 권한이 있는지 확인합니다.(소유자 또는 멤버)
   *
   * @param publicId 테스트 공개 ID
   * @param userId 사용자 ID
   * @param manager EntityManager (Optional)
   * @returns Promise<Test | undefined>
   */
  findByPublicIdAndUserId(publicId: string, userId: number, manager?: EntityManager) {
    return this.createAccessibleQuery(userId, manager)
      .andWhere('tests.publicId = :publicId', { publicId })
      .getOne();
  }

  /**
   * SDK 설치 상태를 공개 ID와 사용자 ID로 조회합니다.
   * 사용자 ID를 기반으로 접근 권한이 있는지 확인합니다.(소유자 또는 멤버)
   *
   * @param publicId 테스트 공개 ID
   * @param userId 사용자 ID
   * @param manager EntityManager (Optional)
   * @returns Promise<Test | undefined>
   */
  findSdkStatusByPublicIdAndUserId(publicId: string, userId: number, manager?: EntityManager) {
    return this.createAccessibleQuery(userId, manager)
      .select(['tests.sdkStatus'])
      .andWhere('tests.publicId = :publicId', { publicId })
      .getOne();
  }

  /**
   * 공개 ID와 사용자 ID로 테스트를 조회합니다.
   * 사용자 ID를 기반으로 접근 권한이 있는지 확인합니다.(소유자 또는 멤버)
   * Members에 대한 정보도 함께 조회합니다.
   *
   * @param publicId 테스트 공개 ID
   * @param userId 사용자 ID
   * @param manager EntityManager (Optional)
   * @returns Promise<Test | undefined>
   */
  findByPublicIdAndUserIdWithMembers(publicId: string, userId: number, manager?: EntityManager) {
    return this.createAccessibleQuery(userId, manager)
      .leftJoinAndSelect('tests.owner', 'owner')
      .leftJoinAndSelect('tests.members', 'members')
      .andWhere('tests.publicId = :publicId', { publicId })
      .getOne();
  }

  /**
   * 공개 ID와 사용자 ID로 테스트를 조회합니다.
   * 사용자 ID를 기반으로 접근 권한이 있는지 확인합니다.(소유자 또는 멤버)
   * Missions에 대한 정보도 함께 조회합니다.
   *
   * @param publicId 테스트 공개 ID
   * @param userId 사용자 ID
   * @param manager EntityManager (Optional)
   * @returns Promise<Test | undefined>
   */
  findByPublicIdAndUserIdWithMissions(publicId: string, userId: number, manager?: EntityManager) {
    return this.createAccessibleQuery(userId, manager)
      .leftJoinAndSelect('tests.missions', 'missions')
      .andWhere('tests.publicId = :publicId', { publicId })
      .getOne();
  }

  /**
   * 공개 ID와 사용자 ID로 테스트를 조회합니다.
   * 사용자 ID를 기반으로 접근 권한이 있는지 확인합니다.(소유자 또는 멤버)
   * Missions와 Members에 대한 정보도 함께 조회합니다.
   *
   * @param publicId 테스트 공개 ID
   * @param userId 사용자 ID
   * @param manager EntityManager (Optional)
   * @returns Promise<Test | undefined>
   */
  findByPublicIdAndUserIdWithMissionsAndMembers(
    publicId: string,
    userId: number,
    manager?: EntityManager,
  ) {
    return this.createAccessibleQuery(userId, manager)
      .leftJoinAndSelect('tests.missions', 'missions')
      .leftJoinAndSelect('tests.members', 'members')
      .andWhere('tests.publicId = :publicId', { publicId })
      .getOne();
  }

  /**
   * 공개 ID와 사용자 ID로 테스트를 조회합니다.
   * 사용자 ID를 기반으로 접근 권한이 있는지 확인합니다.(소유자 또는 멤버)
   * Participants에 대한 정보도 함께 조회합니다.
   *
   * @param publicId 테스트 공개 ID
   * @param userId 사용자 ID
   * @param manager EntityManager (Optional)
   * @returns Promise<Test | undefined>
   */
  findByPublicIdAndUserIdWithParticipants(
    publicId: string,
    userId: number,
    manager?: EntityManager,
  ) {
    return this.createAccessibleQuery(userId, manager)
      .leftJoinAndSelect('tests.participants', 'participants')
      .leftJoinAndSelect('participants.user', 'participantUser')
      .leftJoinAndSelect('participantUser.persona', 'participantPersona')
      .andWhere('tests.publicId = :publicId', { publicId })
      .getOne();
  }

  /**
   * 공개 ID와 사용자 ID로 테스트를 조회합니다.
   * 사용자 ID를 기반으로 접근 권한이 있는지 확인합니다.(소유자 또는 멤버)
   * missions, Participants 및 MissionResults에 대한 정보도 함께 조회합니다.
   *
   * @param publicId 테스트 공개 ID
   * @param userId 사용자 ID
   * @param manager EntityManager (Optional)
   * @returns Promise<Test | undefined>
   */
  findByPublicIdAndUserIdWithRelations(publicId: string, userId: number, manager?: EntityManager) {
    return this.createAccessibleQuery(userId, manager)
      .leftJoinAndSelect('tests.missions', 'missions')
      .leftJoinAndSelect('tests.participants', 'participants')
      .leftJoinAndSelect('participants.missionResults', 'missionResults')
      .leftJoinAndSelect('participants.user', 'participantUser')
      .leftJoinAndSelect('participantUser.persona', 'participantPersona')
      .andWhere('tests.publicId = :publicId', { publicId })
      .getOne();
  }

  /**
   * 한 참가자의 리포트를 생성하기 위한 메서드입니다.
   * 테스트 공개 ID, 참가자 공개 ID 및 사용자 ID로 테스트를 조회합니다.
   * 사용자 ID를 기반으로 접근 권한이 있는지 확인합니다.(소유자 또는 멤버)
   * missions, Participants 및 MissionResults에 대한 정보도 함께 조회합니다.
   *
   * @param testPublicId 테스트 공개 ID
   * @param participantPublicId 참가자 공개 ID
   * @param userId 사용자 ID
   * @param manager EntityManager (Optional)
   * @returns Promise<Test | undefined>
   */
  findForParticipantReport(
    testPublicId: string,
    participantPublicId: string,
    userId: number,
    manager?: EntityManager,
  ) {
    return this.createAccessibleQuery(userId, manager)
      .leftJoinAndSelect('tests.missions', 'missions')
      .leftJoinAndSelect('tests.participants', 'participants')
      .leftJoinAndSelect('participants.missionResults', 'missionResults')
      .leftJoinAndSelect('participants.user', 'participantUser')
      .leftJoinAndSelect('participantUser.persona', 'participantPersona')
      .andWhere('tests.publicId = :testPublicId', { testPublicId })
      .andWhere('participants.publicId = :participantPublicId', { participantPublicId })
      .getOne();
  }

  findByPublicIdAndUserIdWithMissionsAndResults(publicId: string, userId: number) {
    return this.createAccessibleQuery(userId)
      .leftJoinAndSelect('tests.missions', 'missions')
      .leftJoinAndSelect('missions.missionResults', 'missionResults')
      .leftJoinAndSelect('missionResults.participant', 'participant')
      .where('tests.publicId = :publicId', { publicId })
      .orderBy('missions.order', 'ASC')
      .getOne();
  }

  // private 내부 메서드

  /**
   * EntityManager 유무에 따라 적절한 Repository를 반환합니다.
   *
   * @param manager EntityManager (Optional)
   * @returns Repository<Test>
   */
  private getRepo(manager?: EntityManager): Repository<Test> {
    return manager ? manager.getRepository(Test) : this.testsRepository;
  }

  /**
   * 사용자 접근 권한이 있는 테스트만 조회하는 QueryBuilder를 생성합니다.
   *
   * @param userId 사용자 ID
   * @param manager EntityManager (Optional)
   * @returns SelectQueryBuilder<Test>
   */
  private createAccessibleQuery(userId: number, manager?: EntityManager): SelectQueryBuilder<Test> {
    return this.getRepo(manager)
      .createQueryBuilder('tests')
      .where(this.getPermissionCondition()) // 기본적으로 권한 필터 장착
      .setParameter('userId', userId);
  }

  /**
   * 사용자 접근 권한 조건을 반환합니다.
   *
   * @returns Brackets
   */
  private getPermissionCondition() {
    return new Brackets((qb) => {
      qb.where('tests.ownerId = :userId').orWhere((subQb: SelectQueryBuilder<ObjectLiteral>) => {
        const subQuery = subQb
          .subQuery()
          .select('1')
          .from('test_members', 'tm')
          .where('tm.test_id = tests.id')
          .andWhere('tm.member_id = :userId')
          .getQuery();
        return `EXISTS ${subQuery}`;
      });
    });
  }
}
