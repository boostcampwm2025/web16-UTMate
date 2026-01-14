import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

import { CreateMissionResultDto } from './dtos/create-mission-result.dto';
import { MissionResultDto, SimpleMissionResultDto } from './dtos/mission-result.dto';
import { UpdateMissionResultDto } from './dtos/update-mission-result.dto';
import { MissionResult } from './entities/mission-result.entity';
import { MissionResultRepository } from './mission-result.repository';

import { S3StorageService } from '#common/storage/s3-storage.service';
import { StorageService } from '#common/storage/storage.service';

@Injectable()
export class MissionResultService {
  constructor(
    private readonly missionResultRepository: MissionResultRepository,
    private readonly storageService: StorageService,
    private readonly s3StorageService: S3StorageService,
  ) {}

  /**
   * @description 미션 결과 생성
   * @param participantId
   * @param missionId
   * @returns MissionResultDto
   */
  async createMissionResult(dto: CreateMissionResultDto) {
    // missionId 유효성 검사 등 추가 로직 필요
    const missionResult = MissionResult.start(dto.participantId, dto.missionId);
    const savedMissionResult = await this.missionResultRepository.save(missionResult);
    return MissionResultDto.fromEntity(savedMissionResult);
  }

  /**
   * @description 미션 결과 업데이트
   * @param missionResultId
   * @param dto
   * @returns MissionResultDto
   */
  async updateMissionResult(missionResultId: number, dto: UpdateMissionResultDto) {
    // 미션 결과 조회
    const missionResult = await this.missionResultRepository.findById(missionResultId);
    if (!missionResult) {
      throw new NotFoundException('미션 결과를 찾을 수 없습니다.');
    }

    // 저장된 로그 버퍼 조회
    const fileName = `replay_log/missions/${missionResult.missionId}/${missionResult.participantId}.log.jsonl`;
    const logBuffer = await this.storageService.getBufferByFilename(fileName);

    // S3에 업로드 트랜젝션 수행 전 먼저 수행
    const compressedFileName = await this.s3StorageService.uploadToS3(fileName, logBuffer);

    // 트랜젝션 시작
    try {
      // 상태 업데이트
      this.applyStatus(missionResult, dto);

      // 업로드된 로그 파일 URL 저장
      missionResult.recordUploadedFile(compressedFileName);

      // TODO 로그 스트림을 분석 모듈에 보내 분석 후 분석 결과를 업데이드하는 로직 구현

      // 변경된 미션 결과 저장
      await this.missionResultRepository.save(missionResult);
      return MissionResultDto.fromEntity(missionResult);
    } catch (error) {
      // 에러 발생 시 S3에 업로드한 로그 파일 삭제
      await this.s3StorageService.deleteFromS3(fileName);
      // TODO 롤백 처리

      throw new InternalServerErrorException();
    }
  }

  /**
   * @description 미션 결과 조회
   * @param missionResultId
   * @returns MissionResultDto
   */
  async getMissionResult(missionResultId: number) {
    const findMissionResult = await this.missionResultRepository.findById(missionResultId);
    if (!findMissionResult) {
      throw new NotFoundException('미션 결과를 찾을 수 없습니다.');
    }
    const presignedUrl = findMissionResult.filename
      ? await this.s3StorageService.getPresignedUrl(findMissionResult.filename)
      : undefined;
    return MissionResultDto.fromEntity(findMissionResult, presignedUrl);
  }

  /**
   * 미션 ID에 대한 모든 미션 결과들 간단 조회
   * @param missionId
   * @returns
   */
  async getMissionResults(missionId: string) {
    const missionResults = await this.missionResultRepository.findAll(missionId);
    return SimpleMissionResultDto.fromEntities(missionResults);
  }

  /**
   * @description dto 상태에 따른 미션 결과 매서드 호출
   * @param missionResult
   * @param dto
   * @returns
   */
  private applyStatus(missionResult: MissionResult, dto: UpdateMissionResultDto) {
    if (dto.status === 'COMPLETED') {
      missionResult.complete(dto.feedback);
      return;
    }
    if (dto.status === 'FAILED') {
      missionResult.fail(dto.feedback);
      return;
    }
    if (dto.status === 'SKIPPED') {
      missionResult.skip();
      return;
    }
    throw new NotFoundException('유효하지 않은 상태입니다.');
  }
}
