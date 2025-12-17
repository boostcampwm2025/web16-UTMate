import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateMissionResultDto } from './dtos/create-mission-result.dto';
import { MissionResultDto } from './dtos/mission-result.dto';
import { UpdateMissionResultDto } from './dtos/update-mission-result.dto';
import { MissionResult } from './entities/mission-result.entity';
import { MissionResultRepository } from './mission-result.repository';

import { StorageService } from '#common/storage/storage.service';

@Injectable()
export class MissionResultService {
  constructor(
    private readonly missionResultRepository: MissionResultRepository,
    private readonly storageService: StorageService,
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

    // 상태 업데이트
    this.applyStatus(missionResult, dto);

    // 저장된 로그 스트림 조회
    const fileName = `replay_log/${missionResult.participantId}/${missionResult.missionId}/log.ndjson`;
    const _logStream = await this.storageService.getReadStreamByFilename(fileName);

    // TODO 로그 스트림을 압축하여 S3에 업로드하는 로직 구현

    // TODO 로그 스트림을 분석 모듈에 보내 분석 후 분석 결과를 업데이드하는 로직 구현

    // 변경된 미션 결과 저장
    await this.missionResultRepository.save(missionResult);
    return MissionResultDto.fromEntity(missionResult);
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
    return MissionResultDto.fromEntity(findMissionResult);
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
