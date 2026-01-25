import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import Redis from 'ioredis/built/Redis';
import { EntityManager } from 'typeorm';

import { MissionResultDto } from './dto/mission-result.dto';
import { MissionResultDetailDto } from './dto/mission-result-detail.dto';
import { UpdateMissionResultDto } from './dto/update-mission-result.dto';
import { MissionResult } from './entities/mission-result.entity';
import { MissionResultStatus } from './enums';
import { MissionResultsRepository } from './mission-results.repository';

import { SDK_AUTH_REDIS } from '#common/redis/redis.module';
import { S3StorageService } from '#common/storage/s3-storage.service';
import { StorageService } from '#common/storage/storage.service';
import { AnalyzerService } from '#domain/analyzer/analyzer.service';
import { Mission } from '#domain/tests/entities/mission.entity';

@Injectable()
export class MissionResultsService {
  constructor(
    private readonly missionResultsRepository: MissionResultsRepository,
    private readonly storageService: StorageService,
    private readonly s3StorageService: S3StorageService,
    private readonly analyzerService: AnalyzerService,
    @Inject(SDK_AUTH_REDIS) private readonly sdkAuthRedis: Redis,
  ) {}

  /**
   * 각 Mission에 대한 MissionResults 생성합니다.
   *
   * @param missions 미션 배열
   * @param participantId 참가자 id
   * @param manager 트랜잭션 매니저(Optional) : 트랜잭션 내에서 호출할 경우 전달
   * @returns MissionResultDto 배열
   */
  async createMissionResults(missions: Mission[], participantId: number, manager?: EntityManager) {
    const missionResults = missions.map((mission) =>
      MissionResult.create(mission.id, participantId),
    );

    await this.missionResultsRepository.saveAll(missionResults, manager);
    return this.getMissionResultsByParticipantId(participantId, manager);
  }

  /**
   * 참가자 id로 미션 결과들을 조회합니다.
   *
   * @param participantId 참가자 id
   * @param manager 트랜잭션 매니저(Optional) : 트랜잭션 내에서 호출할 경우 전달
   * @returns MissionResultDto 배열
   */
  async getMissionResultsByParticipantId(participantId: number, manager?: EntityManager) {
    const missionResults = await this.missionResultsRepository.findByParticipantIdWithMissions(
      participantId,
      manager,
    );
    return MissionResultDto.fromMissionResultEntities(missionResults);
  }

  /**
   * 파일 시스템에 저장된 로그 파일을 S3로 업로드하고 업로드한 파일 이름을 업데이트합니다.
   * 추후 로그 파일을 분석하여 미션 결과에 반영하는 로직 추가 예정
   *
   * @param publicId 미션 결과 publicId
   * @throws NotFoundException 미션 결과를 찾을 수 없는 경우
   * @throws NotFoundException 로그 파일을 찾을 수 없는 경우 ( 하위 서비스에서 전파 )
   * @throws InternalServerErrorException 로그 파일 업로드에 실패한 경우
   */
  async createMissionResultRecord(publicId: string) {
    const missionResult = await this.missionResultsRepository.findByPublicId(publicId);
    if (!missionResult) {
      throw new NotFoundException('미션 결과를 찾을 수 없습니다.');
    }

    const fileName = `replay_logs/${missionResult.publicId}.log.jsonl`;
    try {
      const logBuffer = await this.storageService.getBufferByFilename(fileName);
      const s3FileName = await this.s3StorageService.uploadToS3(fileName, logBuffer);
      missionResult.recordUploadedFile(s3FileName);

      const results = this.analyzerService.analyze(logBuffer);
      missionResult.analyzeResults(results);

      await this.missionResultsRepository.save(missionResult);
      await this.sdkAuthRedis.del(missionResult.publicId);
      await this.storageService.deleteByFilename(fileName);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      // 업로드 실패 시 S3에 업로드된 파일 삭제
      await this.s3StorageService.deleteFromS3(fileName);
      throw new InternalServerErrorException('로그 파일 업로드에 실패했습니다.');
    }
  }

  /**
   * dto를 기반으로 미션 결과의 상태 및 피드백을 업데이트합니다.
   *
   * @param publicId 미션 결과 publicId
   * @param dto 업데이트할 데이터
   * @throws NotFoundException 미션 결과를 찾을 수 없는 경우
   * @throws BadRequestException 잘못된 상태로 변경하려는 경우
   */
  async updateMissionResult(publicId: string, dto: UpdateMissionResultDto) {
    // 미션 결과 조회
    const missionResult = await this.missionResultsRepository.findByPublicId(publicId);
    if (!missionResult) {
      throw new NotFoundException('미션 결과를 찾을 수 없습니다.');
    }

    // 상태 전이 및 저장
    switch (dto.status) {
      case MissionResultStatus.IN_PROGRESS:
        missionResult.start();
        this.sdkAuthRedis.set(missionResult.publicId, 'in_progress');
        break;
      case MissionResultStatus.SUCCESS:
      case MissionResultStatus.FAILED:
        missionResult.complete(dto.status, dto.feedback);
        break;
      default:
        throw new BadRequestException('유효하지 않은 미션 결과 상태입니다.');
    }
  }

  /**
   * 미션 결과의 상세 정보를 조회합니다.
   *
   * @param userId 테스트 소유자 id
   * @param publicId 미션 결과 public id
   * @returns 미션 결과 상세 DTO
   * @throws NotFoundException 미션 결과를 찾을 수 없거나 소유자가 아닌 경우
   * @throws ForbiddenException 아직 완료되지 않은 미션 결과인 경우
   */
  async getMissionResultsDetail(userId: number, publicId: string) {
    const missionResults =
      await this.missionResultsRepository.findByPublicIdWithAllRelations(publicId);
    if (!missionResults) {
      throw new NotFoundException('미션 결과를 찾을 수 없습니다.');
    }
    if (missionResults.participant.test.ownerId !== userId) {
      throw new NotFoundException('미션 결과를 찾을 수 없습니다.');
    }
    if (
      missionResults.status === MissionResultStatus.PENDING ||
      missionResults.status === MissionResultStatus.IN_PROGRESS
    ) {
      throw new ForbiddenException('아직 완료되지 않은 미션 결과입니다.');
    }

    const presignedUrl = await this.s3StorageService.getPresignedUrl(missionResults.filename!);
    return MissionResultDetailDto.fromMissionResultEntity(missionResults, presignedUrl);
  }

  async dropMissionResultsByParticipantId(participantId: number, manager: EntityManager) {
    const missionResults = await this.missionResultsRepository.findByParticipantId(
      participantId,
      manager,
    );

    for (const missionResult of missionResults) {
      if (missionResult.status === MissionResultStatus.IN_PROGRESS) {
        await this.createMissionResultRecord(missionResult.publicId);
      }
      missionResult.drop();
    }
    await this.missionResultsRepository.saveAll(missionResults, manager);
  }
}
