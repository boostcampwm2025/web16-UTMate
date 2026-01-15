import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { UpdateMissionResultDto } from './dtos/update-mission-result.dto';
import { MissionResult } from './entities/mission-result.entity';
import { MissionResultStatus } from './enums';
import { MissionResultsRepository } from './mission-results.repository';

import { S3StorageService } from '#common/storage/s3-storage.service';
import { StorageService } from '#common/storage/storage.service';

@Injectable()
export class MissionResultsService {
  constructor(
    private readonly missionResultsRepository: MissionResultsRepository,
    private readonly storageService: StorageService,
    private readonly s3StorageService: S3StorageService,
  ) {}

  /**
   * @description MissionResult Entity 생성
   * @param missionId
   * @param participantId
   * @returns publicId
   */
  async createMissionResult(missionId: number, participantId: number) {
    const existsPendingMission =
      await this.missionResultsRepository.existsPendingMissionByParticipantId(participantId);
    if (existsPendingMission) {
      throw new BadRequestException('이미 진행 중인 미션이 존재합니다. 완료 후 다시 시도해주세요.');
    }

    const missionResult = MissionResult.start(missionId, participantId);
    const savedMissionResult = await this.missionResultsRepository.save(missionResult);
    return { missionResultId: savedMissionResult.publicId };
  }

  /**
   * 파일 시스템에 저장된 로그 파일을 S3로 업로드하고 업로드한 파일 이름을 업데이트합니다.
   * 추후 로그 파일을 분석하여
   * @param publicId
   * @returns
   */
  async createMissionResultRecord(publicId: string) {
    const missionResult = await this.missionResultsRepository.findByPublicId(publicId);
    if (!missionResult) {
      throw new NotFoundException('미션 결과를 찾을 수 없습니다.');
    }

    const fileName = `replay_log/missions/${missionResult.missionId}/${missionResult.participantId}.log.jsonl`;
    try {
      const logBuffer = await this.storageService.getBufferByFilename(fileName);
      const s3FileName = await this.s3StorageService.uploadToS3(fileName, logBuffer);
      missionResult.recordUploadedFile(s3FileName);

      /** TODO 로그를 분석 모듈에 보내 분석 후 분석 결과를 업데이트하는 로직 구현
       * ex)
       * const results = await this.analysisService.analyzeLogStream(logBuffer);
       * const missionResult.analyzeResults(results);
       */

      await this.missionResultsRepository.save(missionResult);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      // 업로드 실패 시 S3에 업로드된 파일 삭제
      await this.s3StorageService.deleteFromS3(fileName);
      throw new InternalServerErrorException('로그 파일 업로드에 실패했습니다.');
    }
  }
  /**
   * @description 미션 결과 업데이트
   * @param missionResultId
   * @param dto
   * @returns MissionResultDto
   */
  async updateMissionResult(publicId: string, dto: UpdateMissionResultDto) {
    // 미션 결과 조회
    const missionResult = await this.missionResultsRepository.findByPublicId(publicId);
    if (!missionResult) {
      throw new NotFoundException('미션 결과를 찾을 수 없습니다.');
    }
    if (missionResult.status !== MissionResultStatus.PENDING) {
      throw new BadRequestException('이미 완료된 미션 결과는 수정할 수 없습니다.');
    }
    if (dto.status === MissionResultStatus.PENDING) {
      throw new BadRequestException('미션 결과 상태를 PENDING으로 변경할 수 없습니다.');
    }
    if (!missionResult.filename) {
      throw new BadRequestException(
        '녹화 파일이 존재하지 않습니다. 녹화 완료를 먼저 진행해주세요.',
      );
    }

    missionResult.complete(dto.status, dto.feedback);
    await this.missionResultsRepository.save(missionResult);
  }
}
