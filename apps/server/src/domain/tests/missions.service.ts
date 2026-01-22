import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { MissionOverviewDto } from './dto/result.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { Mission } from './entities/mission.entity';
import { Test } from './entities/test.entity';
import { MissionRepository } from './missions.repository';

import { MissionResultsService } from '#domain/mission-result/misson-results.service';
import { ParticipantsService } from '#domain/participants/participants.service';

@Injectable()
export class MissionsService {
  constructor(
    @Inject() private readonly missionRepository: MissionRepository,
    @Inject() private readonly participantsService: ParticipantsService,
    @Inject() private readonly missionResultsService: MissionResultsService,
  ) {}

  /**
   * 미션들에 대한 업데이트를 처리합니다.
   * updateMissionDtos에 포함된 publicId를 기준으로 기존 미션들을 업데이트합니다.
   * updateMissionDtos에 publicId가 없는 경우 새로운 미션으로 간주하여 추가합니다.
   * 기존에 존재하는 미션 중 updateMissionDtos에 포함되지 않은 미션은 삭제합니다.
   *
   * @param test 테스트 엔티티( 미션들이 속한 테스트 )
   * @param updateMissionDtos 업데이트할 미션 DTO 배열
   * @param manager 트랜잭션 매니저(Optional) : 트랜잭션 내에서 호출할 경우 전달
   */
  async updateMissions(test: Test, updateMissionDtos: UpdateMissionDto[], manager?: EntityManager) {
    const missions = await this.missionRepository.findAllByTest(test, manager);

    const saveMissions = updateMissionDtos
      .filter((dto) => !dto.publicId)
      .map((dto) => dto.toUserEntity(test));

    const deleteMissions: Mission[] = [];

    missions.forEach((mission) => {
      const dto = updateMissionDtos.find((d) => d.publicId === mission.publicId);
      if (dto) {
        mission.update(dto.order, dto.name, dto.description, dto.url);
        saveMissions.push(mission);
        return;
      }
      deleteMissions.push(mission);
    });

    // 추가된 미션 및 업데이트 된 미션 저장
    // 각 항목마다 TypeORM이 개별 쿼리를 날리기 때문에 성능 이슈가 있을 수 있으나 미션의 개수가 많지 않음으로 최적화 보류
    if (saveMissions.length > 0) await this.missionRepository.saveAll(saveMissions, manager);
    // 참조되지 않는 미션 삭제
    if (deleteMissions.length > 0) await this.missionRepository.deleteAll(deleteMissions, manager);
  }

  /**
   * 미션의 상세 결과를 조회합니다.
   *
   * @param userId 테스트 소유자 id
   * @param missionId 미션 public id
   * @returns 미션 상세 결과 DTO
   * @throws NotFoundException 미션을 찾을 수 없거나 소유자가 아닌 경우
   */
  async getMissionResultById(userId: number, missionId: string) {
    const mission = await this.missionRepository.findByPublicIdWithAllRelations(missionId);
    if (!mission) {
      throw new NotFoundException('Mission not found');
    }
    if (mission.test.ownerId !== userId) {
      throw new NotFoundException('Mission not found');
    }
    return MissionOverviewDto.fromEntity(mission);
  }
}
